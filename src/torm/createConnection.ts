import { createConnection, ConnectionOptions } from 'typeorm';

// tslint:disable-next-line
const baseOrmConfig = require('./ormconfig');

export const createDBConnection = (dbOptions: Partial<ConnectionOptions> = {}) => {
  // 'src/**/*.subscriber.ts',
  return createConnection({
    ...baseOrmConfig,
    ...dbOptions
  });
};
