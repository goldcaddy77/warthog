import { ConnectionOptions, createConnection } from 'typeorm';

import { SnakeNamingStrategy } from './SnakeNamingStrategy';

import {
  getDatabaseEntityPaths,
  getDatabaseHost,
  getDatabaseLoggingLevel,
  getDatabaseMigrationPaths,
  getDatabaseName,
  getDatabasePassword,
  getDatabasePort,
  getDatabaseSubscriberPaths,
  getDatabaseType,
  getDatabaseUsername,
  shouldSchronizeDatabaseSchema
} from '../utils/configurationManager';

function getBaseConfig() {
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

export const createDBConnection = (dbOptions: Partial<ConnectionOptions> = {}) => {
  const config = {
    ...getBaseConfig(),
    ...dbOptions
  };

  // console.log('config: ', config);

  if (!config.database) {
    throw new Error("createConnection: 'database' is required");
  }

  return createConnection(config as any); // TODO: fix any.  It is complaining about `type`
};

// Provide a sort of mock DB connection that will create a sqlite DB, but will expose
// all of the TypeORM entity metadata for us.  Ideally, we'd recreate all of the
// TypeORM decorators, but for now, using this "mock" connection and reading from their
// entity metadata is a decent hack
export const mockDBConnection = (dbOptions: Partial<ConnectionOptions> = {}) => {
  return createDBConnection({
    ...dbOptions,
    database: getDatabaseName(),
    host: getDatabaseHost(),
    synchronize: shouldSchronizeDatabaseSchema(),
    type: getDatabaseType()
  } as any);
};
