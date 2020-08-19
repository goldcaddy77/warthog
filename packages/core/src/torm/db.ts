// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import * as pgtools from 'pgtools';
import * as util from 'util';
import { Container } from 'typedi';

import { Config, logger } from '../core';

const config = Container.get('Config') as Config;

export async function createDB() {
  const validationResult = validateDevNodeEnv(config.get('NODE_ENV'), 'create');
  if (validationResult) {
    throw new Error(validationResult);
  }

  const database = config.get('DB_DATABASE');
  if (!database) {
    throw new Error('Database name is required');
  }

  const createDb = util.promisify(pgtools.createdb) as Function;

  try {
    await createDb(getPGConfig(), database);
  } catch (e) {
    if (e.message.indexOf('duplicate') > -1) {
      return logger.log(`Database '${database}' already exists`);
    } else if (e.message) {
      throw new Error(e.message);
    }
    throw new Error(e);
  }
  logger.log(`Database '${database}' created!`);
}

export async function dropDB() {
  const validationResult = validateDevNodeEnv(config.get('NODE_ENV'), 'drop, action: string');
  if (validationResult) {
    throw new Error(validationResult);
  }

  const database = config.get('DB_DATABASE');
  const dropDb = util.promisify(pgtools.dropdb) as Function;

  try {
    await dropDb(getPGConfig(), database);
  } catch (e) {
    if (e.name.indexOf('invalid_catalog_name') > -1) {
      throw new Error(`Database '${database}' does not exist`);
    } else if (e.message) {
      throw new Error(e.message);
    }
    throw new Error(e);
  }
  logger.log(`Database '${database}' dropped!`);
}

function getPGConfig() {
  return {
    host: config.get('DB_HOST'),
    user: config.get('DB_USERNAME'),
    password: config.get('DB_PASSWORD'),
    port: config.get('DB_PORT')
  };
}

function validateDevNodeEnv(env: string, action: string) {
  if (!env) {
    return 'NODE_ENV must be set';
  }
  if (env !== 'development' && env !== 'test' && process.env.WARTHOG_DB_OVERRIDE !== 'true') {
    return `Cannot ${action} database without setting WARTHOG_DB_OVERRIDE environment variable to 'true'`;
  }
  return '';
}
