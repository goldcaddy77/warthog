import 'reflect-metadata';

import { Container } from 'typedi';
import { useContainer as TypeGraphQLUseContainer } from 'type-graphql';
import { useContainer as TypeORMUseContainer } from 'typeorm';

TypeGraphQLUseContainer(Container);
TypeORMUseContainer(Container);

import { App } from '../../src/core';
import { User } from './modules/user/user.entity';

export const app = new App(
  {},
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
