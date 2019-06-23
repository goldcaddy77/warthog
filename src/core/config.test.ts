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

      console.log('config', config);

      expect(config.get('DB_HOST')).toEqual('localhost');
    });
  });
});
