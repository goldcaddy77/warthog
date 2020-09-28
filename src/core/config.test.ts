import { clearConfig } from '../test/server-vars';

import { Config } from './config';

describe('Config', () => {
  beforeEach(() => {
    clearConfig();
  });

  describe('Production', () => {
    test('throws if required values are not specified', async () => {
      process.env.NODE_ENV = 'production';

      try {
        new Config({ configSearchPath: __dirname });
      } catch (error) {
        expect(error.message).toContain('WARTHOG_APP_HOST is required');
      }
    });
  });

  describe('Development', () => {
    test('uses correct defaults', async () => {
      process.env.NODE_ENV = 'development';

      const config = new Config({ configSearchPath: __dirname });

      expect(config.get('DB_HOST')).toEqual('localhost');
    });
  });

  describe('Test', () => {
    test('will never open playground', async () => {
      process.env = {
        NODE_ENV: 'development',
        WARTHOG_AUTO_OPEN_PLAYGROUND: 'true',
        JEST_WORKER_ID: '12345'
      };

      const config = new Config({ configSearchPath: __dirname });

      expect(config.get('WARTHOG_AUTO_OPEN_PLAYGROUND')).toEqual('false');
    });
  });

  describe('All environments', () => {
    test('translates TYPEORM env vars into warthog config', async () => {
      process.env = {
        NODE_ENV: 'development',
        TYPEORM_FOO: 'baz456'
      };

      const config = new Config({ configSearchPath: __dirname });

      expect(config.get('WARTHOG_DB_FOO')).toEqual('baz456');
    });

    test('uses WARTHOG_DB_URL if filled in', async () => {
      process.env = {
        NODE_ENV: 'development',
        WARTHOG_DB_USERNAME: 'foo',
        WARTHOG_DB_PASSWORD: 'bar',
        WARTHOG_DB_URL:
          'postgres://user123:password456@server-one-two.foo.provider.com:8888/database_name'
      };

      const config = new Config({ configSearchPath: __dirname });

      expect(config.get('WARTHOG_DB_USERNAME')).toEqual('user123');
      expect(config.get('WARTHOG_DB_PASSWORD')).toEqual('password456');
      expect(config.get('WARTHOG_DB_HOST')).toEqual('server-one-two.foo.provider.com');
      expect(config.get('WARTHOG_DB_PORT')).toEqual('8888');
      expect(config.get('WARTHOG_DB_DATABASE')).toEqual('database_name');
    });
  });
});
