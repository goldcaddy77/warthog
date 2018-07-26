// TODO-MVP: Add custom scalars such as graphql-iso-date
// import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';

import { ApolloServer } from 'apollo-server-express';
import express = require('express');
import { Request } from 'express';
import { writeFileSync } from 'fs';
import { printSchema, GraphQLSchema } from 'graphql';
import { Binding } from 'graphql-binding';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import * as path from 'path';
import { buildSchema, useContainer as TypeGraphQLUseContainer } from 'type-graphql'; // formatArgumentValidationError
import { Connection, ConnectionOptions, useContainer as TypeORMUseContainer } from 'typeorm';

import { getRemoteBinding, Context } from './'; // logger
import { DataLoaderMiddleware, healthCheckMiddleware } from '../middleware';
import { SchemaGenerator } from '../schema/';
import { authChecker } from '../tgql';
import { createDBConnection } from '../torm';

export interface AppOptions {
  container?: any; // TODO: fix types - Container from typeDI

  host?: string;
  generatedFolder?: string;
  port?: string | number;
  warthogImportPath?: string;
}
export class App {
  // create TypeORM connection
  connection!: Connection;
  httpServer!: HttpServer | HttpsServer;
  graphQLServer!: ApolloServer;
  appHost: string;
  appPort: number;
  generatedFolder: string;

  constructor(private appOptions: AppOptions, private dbOptions: Partial<ConnectionOptions> = {}) {
    if (this.appOptions.container) {
      // register 3rd party IOC container
      TypeGraphQLUseContainer(this.appOptions.container);
      TypeORMUseContainer(this.appOptions.container);
    }

    this.appHost = this.appOptions.host || process.env.APP_HOST || 'localhost';
    this.appPort = parseInt(String(this.appOptions.port || process.env.APP_PORT), 10) || 4000;
    this.generatedFolder = this.appOptions.generatedFolder || path.join(process.cwd(), 'generated');
  }

  async establishDBConnection(): Promise<Connection> {
    if (!this.connection) {
      this.connection = await createDBConnection(this.dbOptions);
    }

    return this.connection;
  }

  async getBinding(): Promise<Binding> {
    return getRemoteBinding(`http://${this.appHost}:${this.appPort}/graphql`, {
      origin: 'seed-script', // TODO: allow this to be passed in
      token: 'faketoken' // TODO: allow this to be passed in
    });
  }

  async generateTypes() {
    await this.establishDBConnection();

    return SchemaGenerator.generate(
      this.connection.entityMetadatas,
      this.generatedFolder,
      this.appOptions.warthogImportPath
    );
  }

  async start() {
    await this.establishDBConnection();
    await this.generateTypes();

    const schema = await buildSchema({
      authChecker,
      globalMiddlewares: [DataLoaderMiddleware], // ErrorLoggerMiddleware
      resolvers: [process.cwd() + '/**/*.resolver.ts']
      // TODO
      // scalarsMap: [{ type: GraphQLDate, scalar: GraphQLDate }]
    });

    // Write schema to dist folder so that it's available in package
    writeFileSync(`${this.generatedFolder}/schema.graphql`, printSchema(schema as GraphQLSchema), {
      encoding: 'utf8',
      flag: 'w'
    });

    this.graphQLServer = new ApolloServer({
      context: (options: { request: Request }) => {
        const context: Context = {
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
        return context;
      },
      schema,
      formatError: (error: Error) => {
        console.log(error);
        return error;
      }
    });

    const app = express();
    app.use('/health', healthCheckMiddleware);

    this.graphQLServer.applyMiddleware({ app, path: '/graphql' });

    this.httpServer = app.listen({ port: this.appPort }, () =>
      console.log(`🚀 Server ready at http://${this.appHost}:${this.appPort}${this.graphQLServer.graphqlPath}`)
    );

    // // Configure server options
    // const serverOptions: Options = {
    //   endpoint: '/graphql',
    //   formatError: formatArgumentValidationError,
    //   playground: '/playground',
    //   port: this.appPort
    // };

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
