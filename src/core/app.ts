// TODO-MVP: Add custom scalars such as graphql-iso-date
// import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';

import { ApolloServer } from 'apollo-server-express';
import express = require('express');
import { Request } from 'express';
import { writeFileSync } from 'fs';
import { printSchema, GraphQLSchema } from 'graphql';
import { Binding } from 'graphql-binding';
import { Server as HttpServer, request } from 'http';
import { Server as HttpsServer } from 'https';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import { Container } from 'typedi';
import { buildSchema, useContainer as TypeGraphQLUseContainer } from 'type-graphql'; // formatArgumentValidationError
import { Connection, ConnectionOptions, useContainer as TypeORMUseContainer } from 'typeorm';

import { getRemoteBinding } from './';
import { DataLoaderMiddleware, healthCheckMiddleware } from '../middleware';
import { SchemaGenerator } from '../schema/';
import { authChecker } from '../tgql';
import { createDBConnection } from '../torm';
import { generateBindingFile } from './binding';

export interface AppOptions {
  container?: Container;
  host?: string;
  generatedFolder?: string;
  middlewares?: any[]; // TODO: fix
  port?: string | number;
  warthogImportPath?: string;
}

type Maybe<T> = T | void;

export class App<Context> {
  connection!: Connection;
  httpServer!: HttpServer | HttpsServer;
  graphQLServer!: ApolloServer;
  appHost: string;
  appPort: number;
  generatedFolder: string;
  schema?: GraphQLSchema;

  constructor(private appOptions: AppOptions, private dbOptions: Partial<ConnectionOptions> = {}) {
    if (!process.env.NODE_ENV) {
      throw new Error("NODE_ENV must be set - use 'development' locally");
    }

    if (this.appOptions.container) {
      // register 3rd party IOC container
      TypeGraphQLUseContainer(this.appOptions.container as any); // TODO: fix any
      TypeORMUseContainer(this.appOptions.container as any); // TODO: fix any
    }

    const host: Maybe<string> = this.appOptions.host || process.env.APP_HOST;
    if (!host) {
      throw new Error('`host` is required');
    }

    this.appHost = host;
    this.appPort = parseInt(String(this.appOptions.port || process.env.APP_PORT), 10) || 4000;
    this.generatedFolder = this.appOptions.generatedFolder || path.join(process.cwd(), 'generated');

    mkdirp.sync(this.generatedFolder);
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

  async generateTypes() {
    await this.establishDBConnection();

    return SchemaGenerator.generate(
      this.connection.entityMetadatas,
      this.generatedFolder,
      this.appOptions.warthogImportPath
    );
  }

  async buildGraphQLSchema(): Promise<GraphQLSchema> {
    if (!this.schema) {
      this.schema = await buildSchema({
        authChecker,
        // TODO: ErrorLoggerMiddleware
        globalMiddlewares: [DataLoaderMiddleware, ...(this.appOptions.middlewares || [])],
        resolvers: [process.cwd() + '/**/*.resolver.ts']
        // TODO: scalarsMap: [{ type: GraphQLDate, scalar: GraphQLDate }]
      });
    }

    return this.schema;
  }

  private async writeToGeneratedFolder(filename: string, contents: string) {
    return writeFileSync(path.join(this.generatedFolder, filename), contents, {
      encoding: 'utf8',
      flag: 'w'
    });
  }

  async writeSchemaFile() {
    this.buildGraphQLSchema();

    return this.writeToGeneratedFolder('schema.graphql', printSchema(this.schema as GraphQLSchema));
  }

  // Write an index file that loads `classes` so that you can just import `../../generated`
  async writeGeneratedIndexFile() {
    return this.writeToGeneratedFolder('index.ts', `export * from './classes';`);
  }

  async start() {
    await this.writeGeneratedIndexFile();
    await this.establishDBConnection();
    await this.generateTypes();
    await this.writeSchemaFile();
    await this.generateBinding();

    this.graphQLServer = new ApolloServer({
      context: (options: { request: Request; context?: any }) => {
        console.log('request', request);

        // TODO: FIX THIS
        const context: any = {
          connection: this.connection,
          dataLoader: {
            initialized: false,
            loaders: {}
          },
          request: options.request,
          user: {
            email: 'admin@test.com',
            id: 'abc12345',
            permissions: ['user:read', 'user:update', 'user:create', 'user:delete', 'photo:delete']
          }
        };
        return { ...context, ...(options.context || {}) };
      },
      schema: this.schema
    });

    const app = express();
    app.use('/health', healthCheckMiddleware);

    this.graphQLServer.applyMiddleware({ app, path: '/graphql' });

    this.httpServer = app.listen({ port: this.appPort }, () =>
      console.log(`🚀 Server ready at http://${this.appHost}:${this.appPort}${this.graphQLServer.graphqlPath}`)
    );

    return this;
  }

  async stop() {
    console.log('Stopping HTTP Server');
    await this.httpServer.close();
    console.log('Closing DB Connection');
    await this.connection.close();
  }
}

export { ConnectionOptions };
