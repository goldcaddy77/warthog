// TODO-MVP: Add custom scalars such as graphql-iso-date
// import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';

import { ApolloServer, OptionsJson, ApolloServerExpressConfig } from 'apollo-server-express';
import { Request } from 'express';
import express = require('express');
import { GraphQLSchema } from 'graphql';
import { Binding } from 'graphql-binding';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
const open = require('open'); // eslint-disable-line @typescript-eslint/no-var-requires
import { AuthChecker } from 'type-graphql'; // formatArgumentValidationError
import { Container } from 'typedi';
import { Connection, ConnectionOptions, useContainer as TypeORMUseContainer } from 'typeorm';

import { logger, Logger } from '../core/logger';
import { debug } from '../decorators';
import { getRemoteBinding } from '../gql';
import { healthCheckMiddleware } from '../middleware';
import { SchemaBuilder } from '../schema';
import { createDBConnection } from '../torm';

import { CodeGenerator } from './code-generator';
import { Config } from './config';
import { BaseContext } from './Context';

export interface ServerOptions<T> {
  container?: Container;
  apolloConfig?: ApolloServerExpressConfig;
  authChecker?: AuthChecker<T>;
  autoGenerateFiles?: boolean;
  context?: (request: Request) => object;
  expressApp?: express.Application;
  host?: string;
  generatedFolder?: string;
  logger?: Logger;
  middlewares?: any[]; // TODO: fix
  openPlayground?: boolean;
  port?: string | number;
  resolversPath?: string[];
  warthogImportPath?: string;
  introspection?: boolean; // DEPRECATED
  bodyParserConfig?: OptionsJson;
  onBeforeGraphQLMiddleware?: (app: express.Application) => void;
  onAfterGraphQLMiddleware?: (app: express.Application) => void;
}

export class Server<C extends BaseContext> {
  config: Config;
  apolloConfig?: ApolloServerExpressConfig;
  authChecker?: AuthChecker<C>;
  connection!: Connection;
  container: Container;
  expressApp!: express.Application;
  graphQLServer!: ApolloServer;
  httpServer!: HttpServer | HttpsServer;
  logger: Logger;
  schema?: GraphQLSchema;
  bodyParserConfig?: OptionsJson;
  schemaBuilder: SchemaBuilder;

  constructor(
    private appOptions: ServerOptions<C>,
    private dbOptions: Partial<ConnectionOptions> = {}
  ) {
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

    this.authChecker = this.appOptions.authChecker;
    this.bodyParserConfig = this.appOptions.bodyParserConfig;
    this.apolloConfig = this.appOptions.apolloConfig || {};

    this.logger = this.getLogger();

    // NOTE: this should be after we hard-code the WARTHOG_ env vars above because we want the config
    // module to think they were set by the user
    this.config = Container.get('Config') as Config;
    this.schemaBuilder = Container.get('SchemaBuilder') as SchemaBuilder;

    this.expressApp = this.appOptions.expressApp || express();

    if (!process.env.NODE_ENV) {
      throw new Error("NODE_ENV must be set - use 'development' locally");
    }
  }

  getLogger(): Logger {
    if (this.appOptions.logger) {
      return this.appOptions.logger;
      // } else if (Container.has('warthog.logger')) {
      //   return Container.get('warthog.logger');
    }
    return logger;
  }

  @debug('warthog:server')
  async establishDBConnection(): Promise<Connection> {
    if (!this.connection) {
      this.connection = await createDBConnection(this.dbOptions);
    }

    return this.connection;
  }

  getServerUrl() {
    return `${this.config.get('APP_PROTOCOL')}://${this.config.get('APP_HOST')}:${this.config.get(
      'APP_PORT'
    )}`;
  }

  getGraphQLServerUrl() {
    return `${this.getServerUrl()}/graphql`;
  }

  async getBinding(options: { origin?: string; token?: string } = {}): Promise<Binding> {
    let binding;
    try {
      binding = await getRemoteBinding(this.getGraphQLServerUrl(), {
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

  @debug('warthog:server')
  async buildGraphQLSchema(): Promise<GraphQLSchema> {
    if (!this.schema) {
      this.schema = await this.schemaBuilder.build({
        authChecker: this.authChecker,
        middlewares: this.appOptions.middlewares
      });
    }

    return this.schema;
  }

  // @debug
  async generateFiles(): Promise<void> {
    const generator = Container.get('CodeGenerator') as CodeGenerator;
    return generator.generate();
  }

  private startHttpServer(url: string): void {
    const keepAliveTimeout = Number(this.config.get('WARTHOG_KEEP_ALIVE_TIMEOUT_MS'));
    const headersTimeout = Number(this.config.get('WARTHOG_HEADERS_TIMEOUT_MS'));

    this.httpServer = this.expressApp.listen({ port: this.config.get('APP_PORT') }, () =>
      this.logger.info(`🚀 Server ready at ${url}`)
    );

    this.httpServer.keepAliveTimeout = keepAliveTimeout;
    this.httpServer.headersTimeout = headersTimeout;
  }

  @debug('warthog:server')
  async start() {
    await this.establishDBConnection();
    if (this.config.get('AUTO_GENERATE_FILES') === 'true') {
      await this.generateFiles();
    }
    await this.buildGraphQLSchema();

    const contextGetter =
      this.appOptions.context ||
      (async () => {
        return {};
      });

    // See all options here: https://github.com/apollographql/apollo-server/blob/9ffb4a847e1503ea2ab1f3fcd47837daacf40870/packages/apollo-server-core/src/types.ts#L69
    const playgroundOption = this.config.get('PLAYGROUND') === 'true' ? { playground: true } : {};
    const introspectionOption =
      this.config.get('INTROSPECTION') === 'true' ? { introspection: true } : {};

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
      ...playgroundOption,
      ...introspectionOption,
      schema: this.schema,
      ...this.apolloConfig
    });

    this.expressApp.use('/health', healthCheckMiddleware);

    if (this.appOptions.onBeforeGraphQLMiddleware) {
      this.appOptions.onBeforeGraphQLMiddleware(this.expressApp);
    }

    this.graphQLServer.applyMiddleware({
      app: this.expressApp,
      bodyParserConfig: this.bodyParserConfig,
      path: '/graphql'
    });

    if (this.appOptions.onAfterGraphQLMiddleware) {
      this.appOptions.onAfterGraphQLMiddleware(this.expressApp);
    }

    const url = this.getGraphQLServerUrl();
    this.startHttpServer(url);

    // Open up websocket connection for subscriptions
    if (this.config.get('SUBSCRIPTIONS') === 'true') {
      this.graphQLServer.installSubscriptionHandlers(this.httpServer);
    }

    // Open playground in the browser
    if (this.config.get('AUTO_OPEN_PLAYGROUND') === 'true') {
      // Assigning to variable and logging to appease linter
      open(url, { wait: false });
    }

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
