// TODO-MVP: Add custom scalars such as graphql-iso-date
// import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';

import { writeFileSync } from 'fs';
import { printSchema, GraphQLSchema } from 'graphql';
import { Binding } from 'graphql-binding';
import { GraphQLServer, Options } from 'graphql-yoga';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import * as path from 'path';
import { Container } from 'typedi';
import { buildSchema, formatArgumentValidationError, useContainer as TypeGraphQLUseContainer } from 'type-graphql';
import { Connection, ConnectionOptions, useContainer as TypeORMUseContainer } from 'typeorm';

import { getRemoteBinding, logger } from './';
import { DataLoaderMiddleware, healthCheckMiddleware } from '../middleware';
import { SchemaGenerator } from '../schema/';
import { authChecker, Context } from '../tgql';
import { createDBConnection } from '../torm';

export interface AppOptions {
  host?: string;
  generatedFolder?: string;
  port?: string | number;
  warthogImportPath?: string;
}
export class App {
  // create TypeORM connection
  connection!: Connection;
  httpServer!: HttpServer | HttpsServer;
  graphQLServer!: GraphQLServer;
  appHost: string;
  appPort: number;
  generatedFolder: string;

  constructor(private appOptions: AppOptions, private dbOptions: Partial<ConnectionOptions> = {}) {
    // register 3rd party IOC container
    TypeGraphQLUseContainer(Container);
    TypeORMUseContainer(Container);

    this.appHost = this.appOptions.host || process.env.APP_HOST || 'localhost';
    this.appPort = parseInt(String(this.appOptions.port || process.env.APP_PORT), 10) || 4000;
    this.generatedFolder = this.appOptions.generatedFolder || path.join(process.cwd(), 'generated');
  }

  async getBinding(): Promise<Binding> {
    return getRemoteBinding(`http://${this.appHost}:${this.appPort}/graphql`, {
      origin: 'seed-script', // TODO: allow this to be passed in
      token: 'faketoken' // TODO: allow this to be passed in
    });
  }

  async generateTypes() {
    this.connection = this.connection || (await createDBConnection(this.dbOptions));

    return SchemaGenerator.generateFromMetadataSync(
      this.connection.entityMetadatas,
      this.generatedFolder,
      this.appOptions.warthogImportPath
    );
  }

  async start() {
    this.connection = this.connection || (await createDBConnection(this.dbOptions));

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
      port: this.appPort
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

export { ConnectionOptions };
