import { Config } from './config';

describe('Config', () => {
  describe('Production', () => {
    it('throws if required values are not specified', async () => {
      process.env.NODE_ENV = 'production';

      try {
        new Config({ configSearchPath: __dirname }).loadSync();
      } catch (error) {
        expect(error.message).toContain('WARTHOG_APP_HOST is required');
      }
    });
  });

  describe('Development', () => {
    it('uses correct defaults', async () => {
      process.env.NODE_ENV = 'development';

      const config = new Config({ configSearchPath: __dirname }).loadSync();

      expect(config.get('DB_HOST')).toEqual('localhost');
    });
  });

  describe('Test', () => {
    it('will never open playground', async () => {
      process.env = {
        NODE_ENV: 'development',
        WARTHOG_AUTO_OPEN_PLAYGROUND: 'true',
        JEST_WORKER_ID: '12345'
      };

      const config = new Config({ configSearchPath: __dirname }).loadSync();

      expect(config.get('WARTHOG_AUTO_OPEN_PLAYGROUND')).toEqual('false');
    });
  });

  describe('All environments', () => {
    it('translates TYPEORM env vars into warthog config', async () => {
      process.env = {
        NODE_ENV: 'development',
        TYPEORM_FOO: 'baz456'
      };

      const config = new Config({ configSearchPath: __dirname }).loadSync();

      expect(config.get('WARTHOG_DB_FOO')).toEqual('baz456');
    });
  });
});
