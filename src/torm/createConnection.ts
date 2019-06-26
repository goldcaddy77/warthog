import { ConnectionOptions, createConnection } from 'typeorm';

import { SnakeNamingStrategy } from './SnakeNamingStrategy';
import { logger } from '../core/logger';

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
