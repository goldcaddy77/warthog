
import {
  getDatabaseName,
  getDatabaseEntityPaths,
  getDatabaseHost,
  getDatabaseLoggingLevel,
  getDatabaseMigrationPaths,
  getDatabaseSubscriberPaths,
  getDatabasePassword,
  getDatabasePort,
  shouldSchronizeDatabaseSchema,
  getDatabaseType,
  getDatabaseUsername,
  SnakeNamingStrategy } from '../../../src';

module.exports = {
  cli: {
    entitiesDir: 'src/models',
    migrationsDir: 'db/migrations',
    subscribersDir: 'src/subscribers'
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