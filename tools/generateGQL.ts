// This script reads all of the TypeORM models and generates
// type-graphql Inputs, Args and Enums that we'll use in resolvers

import * as Debug from 'debug';
import { writeFileSync } from 'fs';
import { printSchema } from 'graphql';
import * as path from 'path';
import 'reflect-metadata';
import { buildSchema, useContainer as TypeGraphQLUseContainer } from 'type-graphql';
import { Container } from 'typedi';
import { useContainer as TypeORMUseContainer } from 'typeorm';

import { authChecker, buildSchemaSync, createDBConnection, DataLoaderMiddleware, logger } from '../src/';

const debug = Debug('generate');

// TODO: need a better method for getting root folder
const generatedFolder = path.join(process.cwd(), '/generated');
const resolverPath = path.join(process.cwd(), 'src') + '/**/*.resolver.ts';

// register 3rd party IOC container
TypeGraphQLUseContainer(Container);
TypeORMUseContainer(Container);

async function bootstrap() {
  // create TypeORM connection
  const connection = await createDBConnection();

  // auto-generate inputs and args for models
  const typeGraphQLOutput = buildSchemaSync(connection.entityMetadatas, generatedFolder);

  const schema = await buildSchema({
    authChecker,
    globalMiddlewares: [DataLoaderMiddleware], // ErrorLoggerMiddleware
    resolvers: [resolverPath]
  });

  // Write schema to dist folder so that it's available in package
  writeFileSync(`${generatedFolder}/schema.graphql`, printSchema(schema), {
    encoding: 'utf8',
    flag: 'w'
  });

  await connection.close();
  return typeGraphQLOutput;
}

bootstrap()
  .then((res: any) => {
    debug(res);
    process.exit(0);
  })
  .catch((error: Error) => {
    logger.error(JSON.stringify(error, undefined, 2));
    if (error.stack) {
      logger.error(JSON.stringify(error.stack!.split('\n'), undefined, 2));
    }
    process.exit(1);
  });
