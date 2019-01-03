// TODO-MVP: Add custom scalars such as graphql-iso-date
// import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';
import 'reflect-metadata';

import { writeFileSync } from 'fs';
import { printSchema, GraphQLSchema } from 'graphql';
import { GraphQLServer, Options } from 'graphql-yoga';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import 'reflect-metadata';
import { Container } from 'typedi';
import { buildSchema, formatArgumentValidationError, useContainer as TypeGraphQLUseContainer } from 'type-graphql';
import { Connection, ConnectionOptions, useContainer as TypeORMUseContainer } from 'typeorm';

import { logger } from './';
import { DataLoaderMiddleware, healthCheckMiddleware } from '../middleware';
// import { buildSchemaSync } from '../schema/';
import { authChecker, Context } from '../tgql';
import { createDBConnection } from '../torm';

export interface AppOptions {
  port: string | number;
  generatedFolder?: string;
}
export class App {
  // create TypeORM connection
  connection!: Connection;
  httpServer!: HttpServer | HttpsServer;
  graphQLServer!: GraphQLServer;
  port: number;
  generatedFolder: string;

  constructor(private appOptions: AppOptions, private dbOptions: Partial<ConnectionOptions> = {}) {
    // register 3rd party IOC container
    TypeGraphQLUseContainer(Container);
    TypeORMUseContainer(Container);

    this.port = parseInt(String(this.appOptions.port), 10) || 3000;
    this.generatedFolder = this.appOptions.generatedFolder || process.cwd();
  }

  async start() {
    this.connection = await createDBConnection(this.dbOptions);

    // TODO: should this be pulled out an always done outside of server run? (probably yes)
    // auto-generate inputs and args for models
    // buildSchemaSync(this.connection.entityMetadatas, this.generatedFolder);

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

    // TODO: delete this
    // Close and re-create connection to pull in dynamic tables
    // await this.connection.close();
    // await this.connection.connect();

    // Create GraphQL server
    this.graphQLServer = new GraphQLServer({
      context: ({ request }) => {
        const context: Context = {
          connection: this.connection,
          dataLoader: {
            initialized: false,
            loaders: {}
          },
          request,
          user: {
            email: 'admin@test.com',
            id: 'abc12345',
            permissions: ['user:read', 'user:update', 'user:create', 'user:delete', 'photo:delete']
          }
        };
        return context;
      },
      schema
    });

    // Configure server options
    const serverOptions: Options = {
      endpoint: '/graphql',
      formatError: formatArgumentValidationError,
      playground: '/playground',
      port: this.port
    };

    // Set up health check endpoint
    this.graphQLServer.express.use('/health', healthCheckMiddleware);

    // Start the server
    this.httpServer = await this.graphQLServer.start(serverOptions, ({ port, playground }) => {
      logger.info(`Server is running, GraphQL Playground available at http://localhost:${port}${playground}`);
    });

    return this;
  }

  async stop() {
    console.log('Stopping HTTP Server');
    await this.httpServer.close();
    console.log('Closing DB Connection');
    await this.connection.close();
  }
}
