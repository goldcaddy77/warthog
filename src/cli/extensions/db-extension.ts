import { GluegunToolbox } from 'gluegun';
// TypeORM doesn't allow for the creation of DBs via QueryRunner, so use pgtools
// @ts-ignore
import * as pgtools from 'pgtools';
import * as util from 'util';

import { Config } from '../../';

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.db = {
    create: async function create() {
      const config: any = new Config().loadSync();
      const database = config.get('DB_DATABASE');
      const createDb = util.promisify(pgtools.createdb) as Function;

      try {
        await createDb(getPgConfig(config), database);
      } catch (error) {
        if (error.message.indexOf('duplicate') > 0) {
          toolbox.print.error(`Database '${database}' already exists`);
          return;
        }
      }
      toolbox.print.info(`Database '${database}' created!`);
    },
    drop: async function create() {
      const config: any = new Config().loadSync();
      const database = config.get('DB_DATABASE');
      const dropDb = util.promisify(pgtools.dropdb) as Function;

      try {
        await dropDb(getPgConfig(config), database);
      } catch (error) {
        if (error.name === 'invalid_catalog_name') {
          toolbox.print.error(`Database '${database}' does not exist`);
          return;
        }
      }
      toolbox.print.info(`Database '${database}' dropped!`);
    }
  };
};

async function getPgConfig(config: any) {
  const cfg = {
    host: config.get('DB_HOST'),
    user: config.get('DB_USERNAME'),
    password: config.get('DB_PASSWORD'),
    port: config.get('DB_PORT')
  };

  return cfg;
}
