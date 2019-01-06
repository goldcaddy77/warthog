import { createConnection, ConnectionOptions } from 'typeorm';

// tslint:disable-next-line
import { getBaseConfig } from './ormconfig';

export const createDBConnection = (dbOptions: Partial<ConnectionOptions> = {}) => {
  const baseConfig = getBaseConfig();

  return createConnection({
    ...baseConfig,
    ...dbOptions
  });
};
