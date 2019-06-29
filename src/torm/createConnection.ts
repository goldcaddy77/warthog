import { ConnectionOptions, createConnection } from 'typeorm';

import { SnakeNamingStrategy } from './SnakeNamingStrategy';
import { logger } from '../core/logger';

// TODO: Need to figure out a way for this and the generated ormconfig to be one and the same
export function getBaseConfig() {
  return {
    cli: {
      entitiesDir: 'src/models',
      migrationsDir: 'src/migration',
      subscribersDir: 'src/subscriber'
    },
    database: getDatabaseName(),
    entities: getDatabaseEntityPaths(),
    host: getDatabaseHost(),
    logger: 'advanced-console',
    logging: getDatabaseLoggingLevel(),
    migrations: getDatabaseMigrationPaths(),
    namingStrategy: new SnakeNamingStrategy(),
    password: getDatabasePassword(),
    port: getDatabasePort(),
    subscribers: getDatabaseSubscriberPaths(),
    synchronize: shouldSchronizeDatabaseSchema(),
    type: getDatabaseType(),
    username: getDatabaseUsername()
  };
}

// Note: all DB options should be specified by environment variables
// Either using TYPEORM_<variable> or WARTHOG_DB_<variable>
export const createDBConnection = (dbOptions: Partial<ConnectionOptions> = {}) => {
  const config = {
    ...getBaseConfig(),
    ...dbOptions
  };

  if (!config.database) {
    throw new Error("createConnection: 'database' is required");
  }

  logger.info('config', config);

  return createConnection(config as any); // TODO: fix any.  It is complaining about `type`
};

function getDatabaseName(): string {
  return process.env.WARTHOG_DB_DATABASE!;
}

function getDatabaseType(): string {
  return process.env.WARTHOG_DB_DATABASE_TYPE || process.env.WARTHOG_DB_CONNECTION!;
}

function getDatabaseHost(): string {
  return process.env.WARTHOG_DB_HOST!;
}

function shouldSchronizeDatabaseSchema(): boolean {
  return process.env.WARTHOG_DB_SYNCHRONIZE === 'true';
}

function getDatabaseLoggingLevel() {
  return process.env.WARTHOG_DB_LOGGING!;
}

function getDatabaseEntityPaths(): string[] {
  return process.env.WARTHOG_DB_ENTITIES
    ? process.env.WARTHOG_DB_ENTITIES.split(',')
    : ['src/**/*.model.ts'];
}

function getDatabaseMigrationPaths(): string[] {
  return process.env.WARTHOG_DB_MIGRATIONS
    ? process.env.WARTHOG_DB_MIGRATIONS.split(',')
    : ['src/migration/**/*.ts'];
}

function getDatabaseSubscriberPaths(): string[] {
  return process.env.WARTHOG_DB_SUBSCRIBERS
    ? process.env.WARTHOG_DB_SUBSCRIBERS.split(',')
    : ['src/**/*.model.ts'];
}

function getDatabaseUsername(): string | undefined {
  return process.env.WARTHOG_DB_USERNAME;
}

function getDatabasePassword(): string | undefined {
  return process.env.WARTHOG_DB_PASSWORD;
}

function getDatabasePort(): number {
  return parseInt(process.env.WARTHOG_DB_PORT || '', 10);
}
