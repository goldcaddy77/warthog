import * as path from 'path';
import { Config } from '../../config';

describe('Config (valid file)', () => {
  let config: Config;

  test('loads static config', async () => {
    // Set some defaults or the constructor will blow up in CI
    process.env.WARTHOG_APP_HOST = 'localhost';
    process.env.WARTHOG_APP_PORT = '80';
    process.env.WARTHOG_DB_HOST = 'localhost';
    config = new Config({ configSearchPath: __dirname });

    const vals: any = await config.loadStaticConfigSync();

    expect(vals.WARTHOG_VALIDATE_RESOLVERS).toEqual('true');
    expect(vals.WARTHOG_GENERATED_FOLDER).toEqual(path.join(__dirname, './foo'));
    expect(vals.WARTHOG_RESOLVERS_PATH).toEqual('./r/e/s/o/l/v/e/r/s');
  });

  test('TypeORM ENV vars beat config file', async () => {
    process.env = {
      NODE_ENV: 'development',
      WARTHOG_MODELS_PATH: 'env/models/path'
    };

    const config = new Config({ configSearchPath: __dirname });

    expect(config.get('WARTHOG_MODELS_PATH')).toEqual('env/models/path');
  });

  test('Warthog ENV vars beat TypeORM', async () => {
    process.env = {
      NODE_ENV: 'development',
      WARTHOG_DB_HOST: 'warthog/db/host',
      TYPEORM_HOST: 'typeorm/host'
    };

    const config = new Config({ configSearchPath: __dirname });

    expect(config.get('WARTHOG_DB_HOST')).toEqual('warthog/db/host');
    expect(process.env.WARTHOG_DB_HOST).toEqual('warthog/db/host');
  });
});
