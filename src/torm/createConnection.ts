import { ConnectionOptions, createConnection } from 'typeorm';

import { SnakeNamingStrategy } from './SnakeNamingStrategy';
import { logger } from '../core/logger';

// TODO: Need to figure out a way for this and the generated ormconfig to be one and the same
export function getBaseConfig() {
  return {
    cli: {
      entitiesDir: process.env.WARTHOG_DB_ENTITIES_DIR,
      migrationsDir: process.env.WARTHOG_DB_MIGRATIONS_DIR,
      subscribersDir: process.env.WARTHOG_DB_SUBSCRIBERS_DIR
    },
    database: process.env.WARTHOG_DB_DATABASE!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    entities: getDatabaseEntityPaths(),
    host: process.env.WARTHOG_DB_HOST!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    logger: process.env.WARTHOG_DB_LOGGER,
    logging: process.env.WARTHOG_DB_LOGGING!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    migrations: getDatabaseMigrationPaths(),
    namingStrategy: new SnakeNamingStrategy(),
    password: process.env.WARTHOG_DB_PASSWORD,
    port: parseInt(process.env.WARTHOG_DB_PORT || '', 10),
    subscribers: getDatabaseSubscriberPaths(),
    synchronize: process.env.WARTHOG_DB_SYNCHRONIZE === 'true',
    type: process.env.WARTHOG_DB_DATABASE_TYPE || process.env.WARTHOG_DB_CONNECTION!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    username: process.env.WARTHOG_DB_USERNAME
  };
}

// Note: all DB options should be specified by environment variables
// Either using TYPEORM_<variable> or WARTHOG_DB_<variable>
export const createDBConnection = async (dbOptions: Partial<ConnectionOptions> = {}) => {
  const config = {
    ...getBaseConfig(),
    ...dbOptions
  };

  if (!config.database) {
    throw new Error("createConnection: 'database' is required");
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
