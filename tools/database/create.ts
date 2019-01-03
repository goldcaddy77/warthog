import * as emoji from 'node-emoji';
import { Client } from 'pg';

import { logger } from '../../src/core';

// ormconfig is a js file so it needs to be pulled in this way
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
      client.query(`CREATE DATABASE ${databaseName} ENCODING 'UTF8';`, err => {
        if (err) {
          Promise.reject(err);
        } else {
          logger.info(`database created ${emoji.get('tada')}`);
          client.end();
        }
      });
    } else {
      logger.info('database already exists, skipping...');
      client.end();
    }
    process.exit(0);
  });
});
