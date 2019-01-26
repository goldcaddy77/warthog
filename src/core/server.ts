// TODO-MVP: Add custom scalars such as graphql-iso-date
// import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';

import { ApolloServer } from 'apollo-server-express';
import * as dotenv from 'dotenv';
import { Request } from 'express';
import express = require('express');
import { GraphQLSchema } from 'graphql';
import { Binding } from 'graphql-binding';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import opn = require('opn');
import * as path from 'path';
import { AuthChecker, buildSchema, useContainer as TypeGraphQLUseContainer } from 'type-graphql'; // formatArgumentValidationError
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

export interface ServerOptions<T> {
  container: Container;

  authChecker?: AuthChecker<T>;
  context?: (request: Request) => object;
  host?: string;
  generatedFolder?: string;
  middlewares?: any[]; // TODO: fix
  mockDBConnection?: boolean;
  openPlayground?: boolean;
  port?: string | number;
  resolversPath?: string[];
  warthogImportPath?: string;
}

export class Server<C extends BaseContext> {
  appHost: string;
  appPort: number;
  authChecker: AuthChecker<C>;
  connection!: Connection;
  container: Container;
  generatedFolder: string;
  graphQLServer!: ApolloServer;
  httpServer!: HttpServer | HttpsServer;
  logger: Logger;
  mockDBConnection: boolean = false;
  schema?: GraphQLSchema;

  constructor(
    private appOptions: ServerOptions<C>,
    private dbOptions: Partial<ConnectionOptions> = {}
  ) {
    if (!process.env.NODE_ENV) {
      throw new Error("NODE_ENV must be set - use 'development' locally");
    }
    dotenv.config();

    // Ensure that Warthog, TypeORM and TypeGraphQL are all using the same typedi container

    this.container = this.appOptions.container;
    TypeGraphQLUseContainer(this.container as any); // TODO: fix any
    TypeORMUseContainer(this.container as any); // TODO: fix any

    const host: Maybe<string> = this.appOptions.host || process.env.APP_HOST;
    if (!host) {
      throw new Error('`host` is required');
    }
    this.appHost = host;
    this.appPort = parseInt(String(this.appOptions.port || process.env.APP_PORT), 10) || 4000;
    this.authChecker = this.appOptions.authChecker || authChecker;

    // Use https://github.com/inxilpro/node-app-root-path to find project root
    this.generatedFolder = this.appOptions.generatedFolder || path.join(process.cwd(), 'generated');
    // Set this so that we can pull in decorators later
    Container.set('warthog:generatedFolder', this.generatedFolder);

    this.logger = Container.has('LOGGER') ? Container.get('LOGGER') : logger;
  }

  async establishDBConnection(): Promise<Connection> {
    if (!this.connection) {
      // Asking for a mock connection will not connect to your preferred DB and will instead
      // connect to sqlite so that you can still access all metadata
      const connectionFn = this.appOptions.mockDBConnection ? mockDBConnection : createDBConnection;

      this.connection = await connectionFn(this.dbOptions);
    }

    return this.connection;
  }

  async getBinding(options: { origin?: string; token?: string } = {}): Promise<Binding> {
    return getRemoteBinding(`http://${this.appHost}:${this.appPort}/graphql`, {
      origin: 'warthog',
      ...options
    });
  }

  async buildGraphQLSchema(): Promise<GraphQLSchema> {
    if (!this.schema) {
      this.schema = await buildSchema({
        authChecker: this.authChecker,
        // TODO: ErrorLoggerMiddleware
        globalMiddlewares: [DataLoaderMiddleware, ...(this.appOptions.middlewares || [])],
        resolvers: [process.cwd() + '/**/*.resolver.ts']
        // TODO: scalarsMap: [{ type: GraphQLDate, scalar: GraphQLDate }]
      });
    }

    return this.schema;
  }

  async generateFiles(): Promise<void> {
    await this.establishDBConnection();

    await new CodeGenerator(this.connection, this.generatedFolder, {
      resolversPath: this.appOptions.resolversPath,
      warthogImportPath: this.appOptions.warthogImportPath
    }).generate();
  }

  async start() {
    await this.establishDBConnection();
    await this.buildGraphQLSchema();
    await this.generateFiles();

    const contextGetter =
      this.appOptions.context ||
      (() => {
        return {};
      });

    this.graphQLServer = new ApolloServer({
      context: (options: { req: Request }) => {
        return {
          connection: this.connection,
          dataLoader: {
            initialized: false,
            loaders: {}
          },
          request: options.req,
          // Allows consumer to add to the context object - ex. context.user
          ...contextGetter(options.req)
        };
      },
      schema: this.schema
    });

    const app = express();
    app.use('/health', healthCheckMiddleware);

    this.graphQLServer.applyMiddleware({ app, path: '/graphql' });

    const url = `http://${this.appHost}:${this.appPort}${this.graphQLServer.graphqlPath}`;

    this.httpServer = app.listen({ port: this.appPort }, () =>
      this.logger.info(`🚀 Server ready at ${url}`)
    );

    // Open playground in the browser
    if (this.shouldOpenPlayground()) {
      opn(url, { wait: false });
    }

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
