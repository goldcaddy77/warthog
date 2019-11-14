import * as cosmiconfig from 'cosmiconfig';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { Container, Service } from 'typedi';

import { ObjectUtil } from '../utils';
import { Logger } from '../core';

interface ConfigOptions {
  dotenvPath?: string;
  configSearchPath?: string;
  container?: Container;
  logger?: Logger;
}

const CONFIG_VALUE_VALID_KEYS = [
  'allowOptionalIdOnCreate',
  'generatedFolder',
  'cliGeneratePath',
  'moduleImportPath',
  'resolversPath'
];

interface StaticConfigFile {
  [key: string]: any;

  generatedFolder: string;
  resolversPath: string | string[];
}

interface StaticConfigResponse {
  filepath: string;
  config: StaticConfigFile;
}

@Service('Config')
export class Config {
  readonly WARTHOG_ENV_PREFIX = 'WARTHOG_';
  readonly TYPEORM_ENV_PREFIX = 'TYPEORM_';
  readonly WARTHOG_DB_ENV_PREFIX = 'WARTHOG_DB_';

  defaults: Record<string, any>;
  devDefaults: Record<string, any>;
  PROJECT_ROOT: string;
  container: Container;
  logger?: Logger;
  NODE_ENV?: string;

  // The full config object
  config: any;

  constructor(private options: ConfigOptions = {}) {
    this.PROJECT_ROOT = process.cwd();
    this.container = options.container || Container;
    this.logger = options.logger;

    this.defaults = {
      WARTHOG_DB_CONNECTION: 'postgres',
      WARTHOG_ROOT_FOLDER: this.PROJECT_ROOT,
      WARTHOG_ALLOW_OPTIONAL_ID_ON_CREATE: 'false',
      WARTHOG_APP_PROTOCOL: 'https',
      WARTHOG_AUTO_GENERATE_FILES: 'false',
      WARTHOG_AUTO_OPEN_PLAYGROUND: 'false',
      WARTHOG_INTROSPECTION: 'true',
      WARTHOG_CLI_GENERATE_PATH: './src',
      WARTHOG_DB_ENTITIES: [path.join(this.PROJECT_ROOT, 'src/**/*.model.ts')],
      WARTHOG_DB_ENTITIES_DIR: 'src/models',
      WARTHOG_DB_LOGGER: 'advanced-console',
      WARTHOG_DB_MIGRATIONS: ['db/migrations/**/*.ts'],
      WARTHOG_DB_MIGRATIONS_DIR: 'db/migrations',
      WARTHOG_DB_PORT: 5432,
      WARTHOG_DB_SUBSCRIBERS: ['src/subscribers/**/*.ts'],
      WARTHOG_DB_SUBSCRIBERS_DIR: 'src/subscribers',
      WARTHOG_DB_SYNCHRONIZE: 'false',
      WARTHOG_MODULE_IMPORT_PATH: 'warthog',
      // TODO: eventually we should do this path resolution when we ask for the variable with `get`
      WARTHOG_GENERATED_FOLDER: path.join(this.PROJECT_ROOT, 'generated'),
      WARTHOG_RESOLVERS_PATH: [path.join(this.PROJECT_ROOT, 'src/**/*.resolver.ts')]
    };

    this.devDefaults = {
      WARTHOG_APP_HOST: 'localhost',
      WARTHOG_APP_PORT: '4000',
      WARTHOG_APP_PROTOCOL: 'http',
      WARTHOG_AUTO_GENERATE_FILES: 'true',
      WARTHOG_AUTO_OPEN_PLAYGROUND: 'true',
      WARTHOG_DB_HOST: 'localhost',
      WARTHOG_DB_LOGGING: 'all'
    };

    const dotenvPath = options.dotenvPath || this.PROJECT_ROOT;
    this.NODE_ENV = this.determineNodeEnv(dotenvPath);
    this.loadDotenvFiles(dotenvPath);

    return this.loadSync();
  }

  // Allow NODE_ENV to be set in the .env file.  Check for this first here and then fall back on
  // the environment variable.  The reason we do this is because using dotenvi will allow us to switch
  // between environments.  If we require an actual environment variable to be set then we'll have to set
  // and unset the value in the current terminal buffer.
  determineNodeEnv(dotenvPath: string) {
    let nodeEnv = process.env.NODE_ENV;

    const filepath = path.join(dotenvPath, '.env');
    if (fs.existsSync(filepath)) {
      const config = dotenv.parse(fs.readFileSync(filepath));
      if (config.NODE_ENV) {
        nodeEnv = config.NODE_ENV;
      }
    }

    return (this.NODE_ENV = process.env.NODE_ENV = nodeEnv);
  }

  loadDotenvFiles(dotenvPath: string) {
    // .local files are for secrets, load those first
    const files = [`.env.local.${this.NODE_ENV}`, '.env.local', '.env'];

    files.forEach((filename: string) => {
      const filepath = path.join(dotenvPath, filename);
      if (fs.existsSync(filepath)) {
        dotenv.config({ path: filepath });
      }
    });
  }

  loadSync(): Config {
    const devOptions = this.NODE_ENV === 'development' ? this.devDefaults : {};
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
      ...this.typeORMToWarthogEnvVariables(),
      ...this.warthogEnvVariables()
    };

    // If Jest is running, be smart and don't open playground
    if (typeof process.env.JEST_WORKER_ID !== 'undefined') {
      (combined as any).WARTHOG_AUTO_OPEN_PLAYGROUND = 'false';
    }

    // Make sure to set the DB connection if we're using a mock DB
    if (combined['WARTHOG_MOCK_DATABASE'] === 'true') {
      combined['WARTHOG_DB_CONNECTION'] = 'sqlite';
      combined['WARTHOG_DB_DATABASE'] = 'warthog.sqlite.tmp';
      combined['WARTHOG_DB_SYNCHRONIZE'] = 'true';
    }

    this.config = combined;

    // Must be after config is set above
    this.validateEntryExists('WARTHOG_APP_HOST');
    this.validateEntryExists('WARTHOG_APP_PORT');
    this.validateEntryExists('WARTHOG_GENERATED_FOLDER');
    this.validateEntryExists('WARTHOG_DB_CONNECTION');
    this.validateEntryExists('WARTHOG_DB_HOST');

    // Now that we've pulled all config in from the waterfall, write `WARTHOG_DB_` keys to `TYPEORM_`
    // So that TypeORM will pick them up
    // this.writeWarthogConfigToTypeORMEnvVars();

    // Once we've combined all of the Warthog ENV vars, write them to process.env so that they can be used elsewhere
    // NOTE: this is likely a bad idea and we should use Containers
    this.writeWarthogEnvVars();

    (this.container as any).set('warthog.logger', this.logger); // Save for later so we can pull globally

    if (this.logger && this.logger.debug) {
      this.logger.debug('loadSync complete', this.get());
    }

    return this;
  }

  public get(key?: string) {
    if (!key) {
      return this.config;
    }

    const lookup = key.startsWith(this.WARTHOG_ENV_PREFIX)
      ? key
      : `${this.WARTHOG_ENV_PREFIX}${key}`;

    return this.config[lookup];
  }

  public warthogEnvVariables() {
    return this.envVarsByPrefix(this.WARTHOG_ENV_PREFIX);
  }

  public warthogDBEnvVariables() {
    return this.envVarsByPrefix(this.WARTHOG_DB_ENV_PREFIX);
  }

  public typeORMEnvVariables() {
    return this.envVarsByPrefix(this.TYPEORM_ENV_PREFIX);
  }
  public translateEnvVar(key: string, value: string) {
    const arrayTypes = [
      'WARTHOG_DB_ENTITIES',
      'WARTHOG_DB_MIGRATIONS',
      'WARTHOG_DB_SUBSCRIBERS',
      'WARTHOG_RESOLVERS_PATH'
    ];

    const pathTypes = ['WARTHOG_GENERATED_FOLDER'];

    // Should be able to do this, but TypeGraphQL has an issue with relative requires
    // https://github.com/19majkel94/type-graphql/blob/a212fd19f28d3095244c44381617f03e97ec4db3/src/helpers/loadResolversFromGlob.ts#L4
    // const paths = value.split(',');

    if (arrayTypes.indexOf(key) > -1) {
      return value.split(',').map((item: string) => {
        if (path.isAbsolute(item)) {
          return item;
        }
        return path.join(this.PROJECT_ROOT, item);
      });
    }

    if (pathTypes.indexOf(key) > -1) {
      if (path.isAbsolute(value)) {
        return value;
      }

      return path.join(this.PROJECT_ROOT, value);
    }

    return value;
  }

  public envVarsByPrefix(prefix: string) {
    const config: any = {};
    Object.keys(process.env).forEach((key: string) => {
      if (key.startsWith(prefix)) {
        config[key] = this.translateEnvVar(key, process.env[key] || '');
      }
    });
    return config;
  }

  public typeORMToWarthogEnvVariables() {
    const typeORMvars = this.typeORMEnvVariables();
    const config: any = {};

    Object.keys(typeORMvars).forEach((key: string) => {
      const keySuffix = key.substring(this.TYPEORM_ENV_PREFIX.length);

      config[`${this.WARTHOG_DB_ENV_PREFIX}${keySuffix}`] = typeORMvars[key];
    });
    return config;
  }

  // public writeWarthogConfigToTypeORMEnvVars() {
  //   Object.keys(this.config).forEach((key: string) => {
  //     if (key.startsWith(this.WARTHOG_DB_ENV_PREFIX)) {
  //       const keySuffix = key.substring(this.WARTHOG_DB_ENV_PREFIX.length);

  //       process.env[`TYPEORM_${keySuffix}`] = this.get(key);
  //     }
  //   });
  // }

  public writeWarthogEnvVars() {
    Object.keys(this.config).forEach((key: string) => {
      if (key.startsWith(this.WARTHOG_ENV_PREFIX)) {
        process.env[key] = this.get(key);
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

    return ObjectUtil.prefixKeys(constantized, this.WARTHOG_ENV_PREFIX);
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
