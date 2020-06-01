import 'reflect-metadata';

import { Container } from 'typedi';
import { useContainer as typeOrmUseContainer } from 'typeorm';

import { Config } from '../';
import { setTestServerEnvironmentVariables } from '../test/server-vars';

if (!(global as any).__warthog_config__) {
  // Tell TypeORM to use our typedi instance
  typeOrmUseContainer(Container);

  setTestServerEnvironmentVariables();

  const config = new Config({ container: Container });

  (global as any).__warthog_config__ = config.get();

  //   console.log('global.config', (global as any).__warthog_config__);
}

// global.__meteor_runtime_config__ = {ROOT_URL: 'localhost'};
// see jest-environment-node or jest-environment-jsdom and subclass it

// You can wrap your test into transaction:

// beforeEach(() => {
//     return connection.query('START TRANSACTION');
// });
// afterEach(() => {
//     return connection.query('ROLLBACK');
// });

// Database Cleaner
// https://stackoverflow.com/questions/22197148/cleaning-database-after-tests-in-node-js
// https://github.com/emerleite/node-database-cleaner/
