import { Connection, ConnectionOptions, createConnection } from 'typeorm';

import { SnakeNamingStrategy } from './SnakeNamingStrategy';
import { logger } from '../core/logger';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export type WarthogDBConnectionOptions = PostgresConnectionOptions;

// TODO: Need to figure out a way for this and the generated ormconfig to be one and the same
export function getBaseConfig(): WarthogDBConnectionOptions {
  const config: PostgresConnectionOptions = {
    cli: {
      entitiesDir: process.env.WARTHOG_DB_ENTITIES_DIR,
      migrationsDir: process.env.WARTHOG_DB_MIGRATIONS_DIR,
      subscribersDir: process.env.WARTHOG_DB_SUBSCRIBERS_DIR
    },
    database: process.env.WARTHOG_DB_DATABASE!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    entities: getDatabaseEntityPaths(),
    host: process.env.WARTHOG_DB_HOST!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    logger: process.env.WARTHOG_DB_LOGGER as any,
    logging: process.env.WARTHOG_DB_LOGGING! as any, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    migrations: getDatabaseMigrationPaths(),
    namingStrategy: new SnakeNamingStrategy(),
    password: process.env.WARTHOG_DB_PASSWORD,
    port: parseInt(process.env.WARTHOG_DB_PORT || '', 10),
    subscribers: getDatabaseSubscriberPaths(),
    synchronize: process.env.WARTHOG_DB_SYNCHRONIZE === 'true',
    type: 'postgres',
    username: process.env.WARTHOG_DB_USERNAME
  };

  console.log('Replication Check');

  if (process.env.WARTHOG_DB_REPLICA_HOST) {
    console.log('Setting up replication!!!');

    (config as any).replication = {
      master: {
        host: process.env.WARTHOG_DB_HOST!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        port: parseInt(process.env.WARTHOG_DB_PORT || '', 10),
        username: process.env.WARTHOG_DB_USERNAME,
        password: process.env.WARTHOG_DB_PASSWORD,
        database: process.env.WARTHOG_DB_DATABASE! // eslint-disable-line @typescript-eslint/no-non-null-assertion
      },
      slaves: [
        {
          host: process.env.WARTHOG_DB_REPLICA_HOST,
          port: parseInt(process.env.WARTHOG_DB_REPLICA_PORT || '', 10),
          username: process.env.WARTHOG_DB_REPLICA_USERNAME,
          password: process.env.WARTHOG_DB_REPLICA_PASSWORD,
          database: process.env.WARTHOG_DB_REPLICA_DATABASE! // eslint-disable-line @typescript-eslint/no-non-null-assertion
        }
      ]
    };
  }

  return config;
}

// Note: all DB options should be specified by environment variables
// Either using TYPEORM_<variable> or WARTHOG_DB_<variable>
export const createDBConnection = async (
  dbOptions: Partial<ConnectionOptions> = {}
): Promise<Connection> => {
  const config = {
    ...getBaseConfig(),
    ...dbOptions
  };

  if (!config.database) {
    throw new Error("createDBConnection: 'database' is required");
  }

  logger.debug('createDBConnection', config);

  return createConnection(config as any); // TODO: fix any.  It is complaining about `type`
};

function getDatabaseEntityPaths(): string[] {
  return process.env.WARTHOG_DB_ENTITIES
    ? process.env.WARTHOG_DB_ENTITIES.split(',')
    : ['src/**/*.model.ts'];
}

function getDatabaseMigrationPaths(): string[] {
  return process.env.WARTHOG_DB_MIGRATIONS
    ? process.env.WARTHOG_DB_MIGRATIONS.split(',')
    : ['db/migration/**/*.ts'];
}

function getDatabaseSubscriberPaths(): string[] {
  return process.env.WARTHOG_DB_SUBSCRIBERS
    ? process.env.WARTHOG_DB_SUBSCRIBERS.split(',')
    : ['src/**/*.model.ts'];
}
