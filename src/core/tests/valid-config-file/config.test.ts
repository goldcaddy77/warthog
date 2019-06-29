import * as path from 'path';
import { Config } from '../../config';

describe('Config (valid file)', () => {
  let config: Config;

  it('loads static config', async () => {
    config = new Config({ configSearchPath: __dirname });

    const vals: any = await config.loadStaticConfigSync();

    expect(vals.WARTHOG_GENERATED_FOLDER).toEqual(path.join(__dirname, './foo'));
    expect(vals.WARTHOG_MODELS_PATH).toEqual('./bar/baz');
    expect(vals.WARTHOG_RESOLVERS_PATH).toEqual('./r/e/s/o/l/v/e/r/s');
  });

  it('TypeORM ENV vars beat config file', async () => {
    process.env = {
      NODE_ENV: 'development',
      WARTHOG_MODELS_PATH: 'env/models/path'
    };

    const config = new Config({ configSearchPath: __dirname }).loadSync();

    expect(config.get('WARTHOG_MODELS_PATH')).toEqual('env/models/path');
  });

  it('Warthog ENV vars beat TypeORM', async () => {
    process.env = {
      NODE_ENV: 'development',
      WARTHOG_DB_HOST: 'warthog/db/host',
      TYPEORM_HOST: 'typeorm/host'
    };

    const config = new Config({ configSearchPath: __dirname }).loadSync();

    expect(config.get('WARTHOG_DB_HOST')).toEqual('warthog/db/host');
    expect(process.env.WARTHOG_DB_HOST).toEqual('warthog/db/host');
  });
});
