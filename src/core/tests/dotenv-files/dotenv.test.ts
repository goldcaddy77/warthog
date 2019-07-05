import { Config } from '../../config';

describe('Dotenv files', () => {
  it('Pulls config in correct order', async () => {
    process.env = {
      NODE_ENV: 'development',
      WARTHOG_PROPER_ENV_VARIABLE: '12345'
    };

    new Config({ dotenvPath: __dirname }).loadSync();

    expect(process.env.WARTHOG_PROPER_ENV_VARIABLE).toEqual('12345');
    expect(process.env.WARTHOG_ENV_LOCAL_DEVELOPMENT).toEqual('333');
    expect(process.env.WARTHOG_C).toEqual('ENV_LOCAL_DEVELOPMENT');
    expect(process.env.WARTHOG_D).toEqual('ENV_LOCAL_DEVELOPMENT');
    expect(process.env.WARTHOG_ENV_LOCAL).toEqual('222');
    expect(process.env.WARTHOG_B).toEqual('ENV_LOCAL');
    expect(process.env.WARTHOG_ENV).toEqual('111');
    expect(process.env.WARTHOG_A).toEqual('ENV');
  });
});
