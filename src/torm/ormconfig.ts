const assert = require('assert');
const dotenv = require('dotenv');
const SnakeNamingStrategy = require('./SnakeNamingStrategy');

// Load environment variables
dotenv.config();

// If there is only one option, it should be passed as string, not array
let logging: string[] | string = String(process.env.TYPEORM_LOGGING).split(',');
if (logging.length === 1) {
  logging = logging[0];
}

module.exports = {
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber'
  },
  database: process.env.TYPEORM_DATABASE,
  entities: process.env.TYPEORM_ENTITIES || ['src/**/*.entity.ts'],
  host: process.env.TYPEORM_HOST,
  logger: 'advanced-console',
  logging: process.env.TYPEORM_LOGGING || 'all',
  migrations: ['src/migration/**/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
  port: parseInt(process.env.TYPEORM_PORT || '', 10),
  subscribers: ['src/**/*.entity.ts'],
  synchronize:
    typeof process.env.TYPEORM_SYNCHRONIZE !== 'undefined'
      ? process.env.TYPEORM_SYNCHRONIZE
      : process.env.NODE_ENV === 'development',
  type: 'postgres',
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD
};
