import 'reflect-metadata';
import { Container } from 'typedi';
import { useContainer as typeOrmUseContainer } from 'typeorm';
import { setTestServerEnvironmentVariables } from '../test/server-vars';

if (!(global as any).__warthog_loaded__) {
  // Tell TypeORM to use our typedi instance
  typeOrmUseContainer(Container);

  setTestServerEnvironmentVariables();

  (global as any).__warthog_loaded__ = true;
}
