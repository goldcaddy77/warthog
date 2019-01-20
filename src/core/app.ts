// TODO-MVP: Add custom scalars such as graphql-iso-date
// import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';

import { ApolloServer } from 'apollo-server-express';
import { Request } from 'express';
import express = require('express');
import { writeFileSync } from 'fs';
import { GraphQLSchema, printSchema } from 'graphql';
import { Binding } from 'graphql-binding';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import * as mkdirp from 'mkdirp';
import opn = require('opn');
import * as path from 'path';
import { AuthChecker, buildSchema, useContainer as TypeGraphQLUseContainer } from 'type-graphql'; // formatArgumentValidationError
import { Container } from 'typedi';
import { Connection, ConnectionOptions, useContainer as TypeORMUseContainer } from 'typeorm';

import { logger, Logger } from '../core/logger';
import { generateBindingFile, getRemoteBinding } from '../gql';
import { DataLoaderMiddleware, healthCheckMiddleware } from '../middleware';
import { SchemaGenerator } from '../schema/';
import { authChecker } from '../tgql';
import { createDBConnection } from '../torm';

import { BaseContext } from './Context';
import { Maybe } from './types';

export interface AppOptions<T> {
  authChecker?: AuthChecker<T>;
  container?: Container;
  context?: (request: Request) => object;
  host?: string;
  generatedFolder?: string;
  middlewares?: any[]; // TODO: fix
  openPlayground?: boolean;
  port?: string | number;
  warthogImportPath?: string;
}

export class App<C extends BaseContext> {
  appHost: string;
  appPort: number;
  authChecker: AuthChecker<C>;
  connection!: Connection;
  context: (request: Request) => object;
  generatedFolder: string;
  graphQLServer!: ApolloServer;
  httpServer!: HttpServer | HttpsServer;
  logger: Logger;
  openPlayground: boolean;
  schema?: GraphQLSchema;

  constructor(private appOptions: AppOptions<C>, private dbOptions: Partial<ConnectionOptions> = {}) {
    if (!process.env.NODE_ENV) {
      throw new Error("NODE_ENV must be set - use 'development' locally");
    }

    // Ensure that Warthog, TypeORM and TypeGraphQL are all using the same typedi container
    if (this.appOptions.container) {
      TypeGraphQLUseContainer(this.appOptions.container as any); // TODO: fix any
      TypeORMUseContainer(this.appOptions.container as any); // TODO: fix any
    }

    const host: Maybe<string> = this.appOptions.host || process.env.APP_HOST;
    if (!host) {
      throw new Error('`host` is required');
    }
    this.appHost = host;

    this.appPort = parseInt(String(this.appOptions.port || process.env.APP_PORT), 10) || 4000;

    this.authChecker = this.appOptions.authChecker || authChecker;

    // Use https://github.com/inxilpro/node-app-root-path to find project root
    this.generatedFolder = this.appOptions.generatedFolder || path.join(process.cwd(), 'generated');
    this.logger = Container.has('LOGGER') ? Container.get('LOGGER') : logger;

    const returnEmpty = () => {
      return {};
    };
    this.context = this.appOptions.context || returnEmpty;
    this.openPlayground =
      typeof this.appOptions.openPlayground !== 'undefined'
        ? this.appOptions.openPlayground
        : !!(process.env.NODE_ENV === 'development');

    this.createGeneratedFolder();
  }

  createGeneratedFolder() {
    return mkdirp.sync(this.generatedFolder);
  }

  async establishDBConnection(): Promise<Connection> {
    if (!this.connection) {
      if (typeof this.dbOptions.synchronize === 'undefined') {
        this.dbOptions = { ...this.dbOptions, synchronize: process.env.NODE_ENV === 'development' };
      }
      this.connection = await createDBConnection(this.dbOptions);
    }

    return this.connection;
  }

  async getBinding(options: { origin?: string; token?: string } = {}): Promise<Binding> {
    return getRemoteBinding(`http://${this.appHost}:${this.appPort}/graphql`, {
      origin: 'warthog',
      ...options
    });
  }

  async generateBinding() {
    const schemaFilePath = path.join(this.generatedFolder, 'schema.graphql');
    const outputBindingPath = path.join(this.generatedFolder, 'binding.ts');

    return generateBindingFile(schemaFilePath, outputBindingPath);
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

  async start() {
    await this.writeGeneratedIndexFile();
    await this.establishDBConnection();
    await this.writeGeneratedTSTypes();
    await this.writeSchemaFile();
    await this.generateBinding();

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
          ...this.context(options.req)
        };
      },
      schema: this.schema
    });

    const app = express();
    app.use('/health', healthCheckMiddleware);

    this.graphQLServer.applyMiddleware({ app, path: '/graphql' });

    const url = `http://${this.appHost}:${this.appPort}${this.graphQLServer.graphqlPath}`;

    this.httpServer = app.listen({ port: this.appPort }, () => this.logger.info(`🚀 Server ready at ${url}`));

    // Open playground in the browser
    if (this.openPlayground) {
      opn(url);
    }

    return this;
  }

  async stop() {
    this.logger.info('Stopping HTTP Server');
    this.httpServer.close();
    this.logger.info('Closing DB Connection');
    await this.connection.close();
  }

  private async writeGeneratedTSTypes() {
    const generatedTSTypes = await this.getGeneratedTypes();

    return this.writeToGeneratedFolder('classes.ts', generatedTSTypes);
  }

  private async getGeneratedTypes() {
    await this.establishDBConnection();

    return SchemaGenerator.generate(this.connection.entityMetadatas, this.appOptions.warthogImportPath);
  }

  private async writeSchemaFile() {
    await this.buildGraphQLSchema();

    return this.writeToGeneratedFolder('schema.graphql', printSchema(this.schema as GraphQLSchema));
  }

  // Write an index file that loads `classes` so that you can just import `../../generated`
  // in your resolvers
  private async writeGeneratedIndexFile() {
    return this.writeToGeneratedFolder('index.ts', `export * from './classes';`);
  }

  private async writeToGeneratedFolder(filename: string, contents: string) {
    return writeFileSync(path.join(this.generatedFolder, filename), contents, {
      encoding: 'utf8',
      flag: 'w'
    });
  }
}
