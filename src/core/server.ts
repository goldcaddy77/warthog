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
import * as path from 'path';
import { AuthChecker, buildSchema } from 'type-graphql'; // formatArgumentValidationError
import { Container } from 'typedi';
import { Connection, ConnectionOptions, useContainer as TypeORMUseContainer } from 'typeorm';

import { logger, Logger } from '../core/logger';
import { getRemoteBinding } from '../gql';
import { DataLoaderMiddleware, healthCheckMiddleware } from '../middleware';
import { authChecker } from '../tgql';
import { createDBConnection, mockDBConnection } from '../torm';
import { CodeGenerator } from './code-generator';

import { BaseContext } from './Context';
import { Maybe } from './types';

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
  appHost: string;
  appPort: number;
  authChecker: AuthChecker<C>;
  autoGenerateFiles: boolean;
  connection!: Connection;
  container: Container;
  generatedFolder: string;
  graphQLServer!: ApolloServer;
  httpServer!: HttpServer | HttpsServer;
  logger: Logger;
  mockDBConnection: boolean = false;
  resolversPath: string[];
  schema?: GraphQLSchema;
  introspection: boolean = true;
  bodyParserConfig?: OptionsJson;

  constructor(
    private appOptions: ServerOptions<C>,
    private dbOptions: Partial<ConnectionOptions> = {}
  ) {
    if (!process.env.NODE_ENV) {
      throw new Error("NODE_ENV must be set - use 'development' locally");
    }
    dotenv.config();

    // Ensure that Warthog, TypeORM and TypeGraphQL are all using the same typedi container

    this.container = this.appOptions.container || Container;

    TypeORMUseContainer(this.container as any); // TODO: fix any

    const host: Maybe<string> = this.appOptions.host || process.env.APP_HOST;
    if (!host) {
      throw new Error('`host` is required');
    }
    this.appHost = host;
    this.appPort = parseInt(String(this.appOptions.port || process.env.APP_PORT), 10) || 4000;
    this.authChecker = this.appOptions.authChecker || authChecker;
    this.bodyParserConfig = this.appOptions.bodyParserConfig;

    // Use https://github.com/inxilpro/node-app-root-path to find project root
    this.generatedFolder = this.appOptions.generatedFolder || path.join(process.cwd(), 'generated');
    // Set this so that we can pull in decorators later
    Container.set('warthog.generated-folder', this.generatedFolder);

    this.logger = this.getLogger();
    Container.set('warthog.logger', this.logger); // Save for later so we can pull globally

    this.autoGenerateFiles =
      typeof this.appOptions.autoGenerateFiles !== 'undefined'
        ? this.appOptions.autoGenerateFiles
        : process.env.NODE_ENV === 'development';

    this.resolversPath = this.appOptions.resolversPath || [process.cwd() + '/**/*.resolver.ts'];

    this.introspection = !!this.appOptions.introspection;
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
      const connectionFn = this.appOptions.mockDBConnection ? mockDBConnection : createDBConnection;

      this.connection = await connectionFn(this.dbOptions);
      debug('establishDBConnection:end');
    }

    return this.connection;
  }

  async getBinding(options: { origin?: string; token?: string } = {}): Promise<Binding> {
    let binding;
    try {
      binding = await getRemoteBinding(`http://${this.appHost}:${this.appPort}/graphql`, {
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
        resolvers: this.resolversPath
        // TODO: scalarsMap: [{ type: GraphQLDate, scalar: GraphQLDate }]
      });
      debug('buildGraphQLSchema:end');
    }

    return this.schema;
  }

  async generateFiles(): Promise<void> {
    debug('start:generateFiles:start');
    await this.establishDBConnection();

    await new CodeGenerator(this.connection, this.generatedFolder, {
      resolversPath: this.resolversPath,
      warthogImportPath: this.appOptions.warthogImportPath
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

    const url = `http://${this.appHost}:${this.appPort}${this.graphQLServer.graphqlPath}`;
    debug(`url: ${url}`);

    this.httpServer = app.listen({ port: this.appPort }, () =>
      this.logger.info(`🚀 Server ready at ${url}`)
    );

    // Open playground in the browser
    if (this.shouldOpenPlayground()) {
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

  private shouldOpenPlayground(): boolean {
    // If an explicit value is passed in, always use it
    if (typeof this.appOptions.openPlayground !== 'undefined') {
      return this.appOptions.openPlayground;
    }

    // If Jest is running, be smart and don't open playground
    if (typeof process.env.JEST_WORKER_ID !== 'undefined') {
      return false;
    }

    // Otherwise, only open in development
    return process.env.NODE_ENV === 'development';
  }
}

// Backwards compatability.  This was renamed.
export const App = Server;
