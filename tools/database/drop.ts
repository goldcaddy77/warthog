import * as emoji from 'node-emoji';
import { Client } from 'pg';

import { logger } from '../../src/core';
// tslint:disable-next-line:no-var-requires
const ormConfig = require('../../ormconfig');

const client = new Client({
  connectionString: `postgres://${ormConfig.username}:${ormConfig.password}@${ormConfig.host}:${
    ormConfig.port
  }/postgres`
});

process.on('unhandledRejection', err => {
  logger.error(`Could not create database: ${err}`);
  if (client) {
    client.end();
  }

  process.exit(1);
});

const databaseName = ormConfig.database;

logger.info(`Connecting to database: ${databaseName}`);

client.connect().then(() => {
  logger.info('Postgres client connected');
  client.query(`SELECT 1 FROM pg_database WHERE datname='${databaseName}'`).then(result => {
    if (result.rows.length === 0) {
      logger.info('database does not exist, skipping...');
      client.end();
    } else {
      client.query(`DROP DATABASE ${databaseName};`, err => {
        if (err) {
          Promise.reject(err);
        } else {
          logger.info(`database dropped ${emoji.get('boom')}`);
          client.end();
        }
      });
    }
  });
});
