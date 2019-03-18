import { ConnectionOptions, createConnection } from 'typeorm';

import { SnakeNamingStrategy } from './SnakeNamingStrategy';

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
    database: 'warthog.sqlite.tmp',
    synchronize: false,
    type: 'sqlite'
  } as any);
};

function getBaseConfig() {
  return {
    cli: {
      entitiesDir: 'src/models',
      migrationsDir: 'src/migration',
      subscribersDir: 'src/subscriber'
    },
    database: process.env.TYPEORM_DATABASE,
    entities: process.env.TYPEORM_ENTITIES || ['src/**/*.model.ts'],
    host: process.env.TYPEORM_HOST || 'localhost',
    logger: 'advanced-console',
    logging: process.env.TYPEORM_LOGGING || 'all',
    migrations: ['src/migration/**/*.ts'],
    namingStrategy: new SnakeNamingStrategy(),
    password: process.env.TYPEORM_PASSWORD,
    port: parseInt(process.env.TYPEORM_PORT || '', 10) || 5432,
    subscribers: process.env.TYPEORM_SUBSCRIBERS || ['src/**/*.model.ts'],
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    type: 'postgres',
    username: process.env.TYPEORM_USERNAME
  };
}
