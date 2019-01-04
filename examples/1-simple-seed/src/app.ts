import 'reflect-metadata';

import { Container } from 'typedi';
import { useContainer as TypeGraphQLUseContainer } from 'type-graphql';
import { useContainer as TypeORMUseContainer } from 'typeorm';

TypeGraphQLUseContainer(Container);
TypeORMUseContainer(Container);

import { App } from '../../../src/';

import { User } from './modules/user/user.entity';

export const app = new App(
  // Path written in generated classes
  { warthogImportPath: '../../../src' },
  {
    cache: true,
    port: 5432,
    host: 'localhost',
    entities: [User],
    synchronize: true,
    logger: 'advanced-console',
    logging: 'all',
    // dropSchema: true,
    type: 'postgres'
  }
);
