import { StringMap } from '../';

export function setTestServerEnvironmentVariables(overrides?: StringMap) {
  clearConfig();

  const defaultVars = getStandardEnvironmentVariables();
  Object.keys(defaultVars).forEach(key => {
    process.env[key] = defaultVars[key];
  });

  if (!overrides) {
    return;
  }

  Object.keys(overrides).forEach(key => {
    process.env[key] = overrides[key];
  });
}

export function getStandardEnvironmentVariables(): StringMap {
  return {
    WARTHOG_APP_HOST: 'localhost',
    WARTHOG_APP_PORT: '4000',
    WARTHOG_APP_PROTOCOL: 'http',
    WARTHOG_AUTO_GENERATE_FILES: 'true',
    WARTHOG_AUTO_OPEN_PLAYGROUND: 'false',
    WARTHOG_DB_CONNECTION: 'sqlite',
    WARTHOG_DB_DATABASE: 'warthog-test',
    WARTHOG_DB_ENTITIES: 'src/test/modules/**/*.model.ts',
    WARTHOG_DB_HOST: 'localhost',
    WARTHOG_DB_LOGGING: 'all',
    WARTHOG_DB_MIGRATIONS_DIR: './tmp/test/migrations',
    WARTHOG_DB_OVERRIDE: 'true', // Set so that we can do DB stuff outside of NODE_ENV=development
    WARTHOG_DB_USERNAME: 'foo',
    WARTHOG_DB_PASSWORD: '',
    WARTHOG_DB_SYNCHRONIZE: 'true',
    WARTHOG_GENERATED_FOLDER: './src/test/generated',
    WARTHOG_RESOLVERS_PATH: './src/test/modules/**/*.resolver.ts',
    WARTHOG_MODULE_IMPORT_PATH: '../../'
  };
}

export function clearConfig() {
  const WARTHOG_PREFIX = 'WARTHOG_';
  const TYPEORM_PREFIX = 'TYPEORM_';
  Object.keys(process.env).forEach(key => {
    if (key.startsWith(WARTHOG_PREFIX) || key.startsWith(TYPEORM_PREFIX)) {
      delete process.env[key];
    }
  });
}
