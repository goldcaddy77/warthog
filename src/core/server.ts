// TODO-MVP: Add custom scalars such as graphql-iso-date
// import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';

import { ApolloServer, OptionsJson } from 'apollo-server-express';
import * as dotenv from 'dotenv';
import { Request } from 'express';
import express = require('express');
import { GraphQLSchema } from 'graphql';
import { Binding } from 'graphql-binding';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
const open = require('open'); // eslint-disable-line @typescript-eslint/no-var-requires
import { AuthChecker, buildSchema } from 'type-graphql'; // formatArgumentValidationError
import { Container } from 'typedi';
import { Connection, ConnectionOptions, useContainer as TypeORMUseContainer } from 'typeorm';

import { logger, Logger } from '../core/logger';
import { getRemoteBinding } from '../gql';
import { DataLoaderMiddleware, healthCheckMiddleware } from '../middleware';
import { authChecker } from '../tgql';
import { createDBConnection, mockDBConnection } from '../torm';

import { CodeGenerator } from './code-generator';
import { Config } from './config';

import { BaseContext } from './Context';

import * as Debug from 'debug';

const debug = Debug('warthog:server');

export interface ServerOptions<T> {
  container?: Container;

  authChecker?: AuthChecker<T>;
  autoGenerateFiles?: boolean;
  context?: (request: Request) => object;
  host?: string;
  generatedFolder?: string;
  logger?: Logger;
  middlewares?: any[]; // TODO: fix
  mockDBConnection?: boolean;
  openPlayground?: boolean;
  port?: string | number;
  resolversPath?: string[];
  warthogImportPath?: string;
  introspection?: boolean;
  bodyParserConfig?: OptionsJson;
}

export class Server<C extends BaseContext> {
  config: Config;
  authChecker: AuthChecker<C>;
  autoGenerateFiles: boolean;
  connection!: Connection;
  container: Container;
  graphQLServer!: ApolloServer;
  httpServer!: HttpServer | HttpsServer;
  logger: Logger;
  schema?: GraphQLSchema;
  introspection: boolean = true;
  bodyParserConfig?: OptionsJson;

  constructor(
    private appOptions: ServerOptions<C>,
    private dbOptions: Partial<ConnectionOptions> = {}
  ) {
    dotenv.config();

    if (!process.env.NODE_ENV) {
      throw new Error("NODE_ENV must be set - use 'development' locally");
    }

    if (typeof this.appOptions.host !== 'undefined') {
      process.env.WARTHOG_APP_HOST = this.appOptions.host;
      // When we move to v2.0 we'll officially deprecate these config values in favor of ENV vars
      // throw new Error(
      //   '`host` option has been removed, please set `WARTHOG_APP_HOST` environment variable instead'
      // );
    }
    if (typeof this.appOptions.port !== 'undefined') {
      process.env.WARTHOG_APP_PORT = this.appOptions.port.toString();
    }
    if (typeof this.appOptions.generatedFolder !== 'undefined') {
      process.env.WARTHOG_GENERATED_FOLDER = this.appOptions.generatedFolder;
    }
    if (typeof this.appOptions.introspection !== 'undefined') {
      process.env.WARTHOG_INTROSPECTION = this.appOptions.introspection ? 'true' : 'false';
    }
    if (typeof this.appOptions.openPlayground !== 'undefined') {
      process.env.WARTHOG_AUTO_OPEN_PLAYGROUND = this.appOptions.openPlayground ? 'true' : 'false';
    }
    if (typeof this.appOptions.autoGenerateFiles !== 'undefined') {
      process.env.WARTHOG_AUTO_GENERATE_FILES = this.appOptions.autoGenerateFiles
        ? 'true'
        : 'false';
    }

    // Ensure that Warthog, TypeORM and TypeGraphQL are all using the same typedi container
    this.container = this.appOptions.container || Container;
    TypeORMUseContainer(this.container as any); // TODO: fix any

    this.authChecker = this.appOptions.authChecker || authChecker;
    this.bodyParserConfig = this.appOptions.bodyParserConfig;

    this.logger = this.getLogger();
    Container.set('warthog.logger', this.logger); // Save for later so we can pull globally

    this.config = new Config().loadSync();
    Container.set('warthog.config', this.config);
    Container.set('warthog.generated-folder', this.config.get('GENERATED_FOLDER'));

    this.autoGenerateFiles = this.config.get('AUTO_GENERATE_FILES') === 'true';
    this.introspection = this.config.get('INTROSPECTION') === 'true';
  }

  getLogger(): Logger {
    if (this.appOptions.logger) {
      return this.appOptions.logger;
    } else if (Container.has('warthog.logger')) {
      return Container.get('warthog.logger');
    }
    return logger;
  }

  async establishDBConnection(): Promise<Connection> {
    if (!this.connection) {
      debug('establishDBConnection:start');
      // Asking for a mock connection will not connect to your preferred DB and will instead
      // connect to sqlite so that you can still access all metadata
      const connectionFn = this.config.get('MOCK_DATABASE') ? mockDBConnection : createDBConnection;

      this.connection = await connectionFn(this.dbOptions);
      debug('establishDBConnection:end');
    }

    return this.connection;
  }

  getServerUrl() {
    return `${this.config.get('APP_PROTOCOL')}://${this.config.get('APP_HOST')}:${this.config.get(
      'APP_PORT'
    )}`;
  }

  async getBinding(options: { origin?: string; token?: string } = {}): Promise<Binding> {
    let binding;
    try {
      binding = await getRemoteBinding(`${this.getServerUrl()}/graphql`, {
        origin: 'warthog',
        ...options
      });
      return binding;
    } catch (error) {
      if (error.result && error.result.errors) {
        const messages = error.result.errors.map((item: any) => item.message);
        throw new Error(JSON.stringify(messages));
      }
      throw error;
    }
  }

  async buildGraphQLSchema(): Promise<GraphQLSchema> {
    if (!this.schema) {
      debug('buildGraphQLSchema:start');
      this.schema = await buildSchema({
        authChecker: this.authChecker,
        container: this.container as any,
        // TODO: ErrorLoggerMiddleware
        globalMiddlewares: [DataLoaderMiddleware, ...(this.appOptions.middlewares || [])],
        resolvers: this.config.get('RESOLVERS_PATH')
        // TODO: scalarsMap: [{ type: GraphQLDate, scalar: GraphQLDate }]
      });
      debug('buildGraphQLSchema:end');
    }

    return this.schema;
  }

  async generateFiles(): Promise<void> {
    debug('start:generateFiles:start');
    await this.establishDBConnection();

    await new CodeGenerator(this.connection, this.config.get('GENERATED_FOLDER'), {
      resolversPath: this.config.get('RESOLVERS_PATH'),
      warthogImportPath: this.config.get('MODULE_IMPORT_PATH')
    }).generate();

    debug('start:generateFiles:end');
  }

  async start() {
    debug('start:start');
    await this.establishDBConnection();
    if (this.autoGenerateFiles) {
      await this.generateFiles();
    }
    await this.buildGraphQLSchema();

    const contextGetter =
      this.appOptions.context ||
      (async () => {
        return {};
      });

    debug('start:ApolloServerAllocation:start');
    this.graphQLServer = new ApolloServer({
      context: async (options: { req: Request }) => {
        const consumerCtx = await contextGetter(options.req);

        return {
          connection: this.connection,
          dataLoader: {
            initialized: false,
            loaders: {}
          },
          request: options.req,
          // Allows consumer to add to the context object - ex. context.user
          ...consumerCtx
        };
      },
      introspection: this.introspection,
      schema: this.schema
    });

    debug('start:ApolloServerAllocation:end');

    const app = express();
    app.use('/health', healthCheckMiddleware);

    debug('start:applyMiddleware:start');
    this.graphQLServer.applyMiddleware({
      app,
      bodyParserConfig: this.bodyParserConfig,
      path: '/graphql'
    });
    debug('start:applyMiddleware:end');

    const url = `http://${this.config.get('APP_HOST')}:${this.config.get('APP_PORT')}${
      this.graphQLServer.graphqlPath
    }`;

    this.httpServer = app.listen({ port: this.config.get('APP_PORT') }, () =>
      this.logger.info(`🚀 Server ready at ${url}`)
    );

    // Open playground in the browser
    if (this.config.get('AUTO_OPEN_PLAYGROUND') === 'true') {
      // Assigning to variable and logging to appease linter
      const process = open(url, { wait: false });
      debug('process', process);
    }

    debug('start:end');
    return this;
  }

  async stop() {
    this.logger.info('Stopping HTTP Server');
    this.httpServer.close();
    this.logger.info('Closing DB Connection');
    await this.connection.close();
  }
}

// Backwards compatability.  This was renamed.
export const App = Server;
