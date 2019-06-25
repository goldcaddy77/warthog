import * as cosmiconfig from 'cosmiconfig';
import * as dotenv from 'dotenv';
import * as path from 'path';

import { ObjectUtil } from '../utils';

interface ConfigOptions {
  dotenvPath?: string;
  configSearchPath?: string;
}

const CONFIG_VALUE_VALID_KEYS = [
  'generatedFolder',
  'cliGeneratePath',
  'moduleImportPath',
  'modelsPath',
  'resolversPath'
];

interface StaticConfigFile {
  [key: string]: any;

  generatedFolder: string;
  modelsPath: string | string[];
  resolversPath: string | string[];
}

interface StaticConfigResponse {
  filepath: string;
  config: StaticConfigFile;
}

export class Config {
  readonly WARTHOG_PREFIX = 'WARTHOG_';
  readonly DB_PREFIX = 'WARTHOG_DB_';

  readonly lockedOptions = {
    WARTHOG_DB_CONNECTION: 'postgres'
  };

  defaults: Record<string, any>;
  devDefaults: Record<string, any>;

  // The full config object
  config: any;

  constructor(private options: ConfigOptions = {}) {
    if (options.dotenvPath) {
      dotenv.load({ path: options.dotenvPath });
    } else {
      dotenv.config();
    }

    const PROJECT_ROOT = process.cwd();

    this.defaults = {
      WARTHOG_ROOT_FOLDER: PROJECT_ROOT,
      WARTHOG_APP_PROTOCOL: 'https',
      WARTHOG_AUTO_GENERATE_FILES: 'false',
      WARTHOG_AUTO_OPEN_PLAYGROUND: 'false',
      WARTHOG_INTROSPECTION: 'true',
      WARTHOG_CLI_GENERATE_PATH: './src',
      WARTHOG_DB_ENTITIES: [`/src/**/*.model.ts`],
      WARTHOG_DB_LOGGER: 'advanced-console',
      WARTHOG_DB_MIGRATIONS: ['src/migrations/**/*.ts'],
      WARTHOG_DB_MIGRATIONS_DIR: 'src/migrations',
      WARTHOG_DB_PORT: 5432,
      WARTHOG_DB_SUBSCRIBERS: ['src/subscribers/**/*.ts'],
      WARTHOG_DB_SUBSCRIBERS_DIR: 'src/subscribers',
      WARTHOG_MODULE_IMPORT_PATH: 'warthog',
      WARTHOG_GENERATED_FOLDER: path.join(PROJECT_ROOT, 'generated'),
      WARTHOG_RESOLVERS_PATH: [path.join(PROJECT_ROOT, 'src/**/*.resolver.ts')]
    };

    this.devDefaults = {
      WARTHOG_APP_HOST: 'localhost',
      WARTHOG_APP_PORT: '4000',
      WARTHOG_APP_PROTOCOL: 'http',
      WARTHOG_AUTO_GENERATE_FILES: 'true',
      WARTHOG_AUTO_OPEN_PLAYGROUND: 'true',
      WARTHOG_DB_HOST: 'localhost',
      WARTHOG_DB_LOGGING: 'all',
      WARTHOG_DB_SYNCHRONIZE: 'true'
    };

    return this;
  }

  loadSync(): Config {
    const devOptions = process.env.NODE_ENV === 'development' ? this.devDefaults : {};
    const configFile = this.loadStaticConfigSync();

    // Config is loaded as a waterfall.  Items at the top of the object are overwritten by those below, so the order is:
    // - Add application-wide defaults
    // - Add development defaults (if we're runnign in DEV mode)
    // - Load config from config file
    // - Load environment variables
    // - Override with locked options
    const combined = {
      ...this.defaults,
      ...devOptions,
      ...configFile,
      ...this.warthogEnvVariables(),
      ...this.lockedOptions
    };

    // If Jest is running, be smart and don't open playground
    if (typeof process.env.JEST_WORKER_ID !== 'undefined') {
      (combined as any).WARTHOG_AUTO_OPEN_PLAYGROUND = false;
    }

    this.config = combined;

    // Must be after config is set above
    this.validateEntryExists('WARTHOG_APP_HOST');
    this.validateEntryExists('WARTHOG_APP_PORT');
    this.validateEntryExists('WARTHOG_GENERATED_FOLDER');
    this.validateEntryExists('WARTHOG_DB_CONNECTION');
    this.validateEntryExists('WARTHOG_DB_HOST');

    this.writeTypeOrmEnvVars();

    return this;
  }

  public warthogEnvVariables() {
    const config: any = {};
    Object.keys(process.env).map((key: string) => {
      if (key.startsWith(this.WARTHOG_PREFIX)) {
        config[key] = process.env[key];
      }
    });
    return config;
  }

  public get(key: string) {
    const lookup = key.startsWith(this.WARTHOG_PREFIX) ? key : `${this.WARTHOG_PREFIX}${key}`;

    return this.config[lookup];
  }

  public writeTypeOrmEnvVars() {
    Object.keys(process.env).forEach((key: string) => {
      if (key.startsWith(this.DB_PREFIX)) {
        const keySuffix = key.substring(this.DB_PREFIX.length);

        process.env[`TYPEORM_${keySuffix}`] = process.env[key];
      }
    });
  }

  public validateEntryExists(key: string) {
    if (!this.config) {
      throw new Error("Can't validate the base config until after it is generated");
    }

    const value = this.get(key);
    if (!value) {
      throw new Error(
        `Config: ${key} is required: ${value}\n\n${JSON.stringify(this.config)}\n\n${JSON.stringify(
          process.env
        )}`
      );
    }
  }

  loadStaticConfigSync() {
    const response = this.loadStaticConfigFileSync();
    if (typeof response === 'undefined') {
      return {};
    }
    const constantized = ObjectUtil.constantizeKeys(response.config);

    return ObjectUtil.prefixKeys(constantized, this.WARTHOG_PREFIX);
  }

  // Use cosmiconfig to load static config that has to be the same for all environments
  // paths to folders for the most part
  private loadStaticConfigFileSync(): StaticConfigResponse | undefined {
    const explorer = cosmiconfig('warthog');

    // Pull config values from cosmiconfig
    const results = explorer.searchSync(this.options.configSearchPath);
    if (!results || results.isEmpty) {
      return;
    }

    const userConfigKeys = Object.keys(results.config);
    const badKeys = userConfigKeys.filter(x => !CONFIG_VALUE_VALID_KEYS.includes(x));
    if (badKeys.length) {
      throw new Error(
        `Config: invalid keys specified in ${results.filepath}: [${badKeys.join(', ')}]`
      );
    }

    // Make sure the generated folder is an absolute path
    if (results.config.generatedFolder && !path.isAbsolute(results.config.generatedFolder)) {
      results.config.generatedFolder = path.join(
        path.dirname(results.filepath),
        results.config.generatedFolder
      );
    }

    return results as StaticConfigResponse;
  }
}
