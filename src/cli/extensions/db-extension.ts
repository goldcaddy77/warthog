import { GluegunToolbox } from 'gluegun';
// TypeORM doesn't allow for the creation of DBs via QueryRunner, so use pgtools
// @ts-ignore
import * as pgtools from 'pgtools';
import * as util from 'util';

import { getConfig } from '../config';

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.db = {
    create: async function create() {
      const config = await getConfig();
      const createDb = util.promisify(pgtools.createdb) as Function;

      try {
        await createDb(getPgConfig(), config.database);
      } catch (error) {
        if (error.message.indexOf('duplicate') > 0) {
          toolbox.print.error(`Database '${config.database}' already exists`);
          return;
        }
      }
      toolbox.print.info(`Database '${config.database}' created!`);
    },
    drop: async function create() {
      const config = await getConfig();
      const dropDb = util.promisify(pgtools.dropdb) as Function;

      try {
        await dropDb(getPgConfig(), config.database);
      } catch (error) {
        if (error.name === 'invalid_catalog_name') {
          toolbox.print.error(`Database '${config.database}' does not exist`);
          return;
        }
      }
      toolbox.print.info(`Database '${config.database}' dropped!`);
    }
  };
};

async function getPgConfig() {
  const config = await getConfig();
  return {
    host: config.host,
    user: config.username,
    password: config.password,
    port: config.port
  };
}
