import 'reflect-metadata';

import { Container } from 'typedi';
import { useContainer as typeOrmUseContainer } from 'typeorm';

import { Config } from '../';
import { setTestServerEnvironmentVariables } from '../test/server-vars';

if (!(global as any).__warthog_config__) {
  // Tell TypeORM to use our typedi instance
  typeOrmUseContainer(Container);

  setTestServerEnvironmentVariables({ WARTHOG_DB_CONNECT_REPLICA: 'true' });

  const config = new Config({ container: Container });

  (global as any).__warthog_config__ = config.get();
}
