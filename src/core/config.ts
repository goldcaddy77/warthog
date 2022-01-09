import { cosmiconfigSync } from 'cosmiconfig';
import * as Debug from 'debug';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { Container, Service } from 'typedi';
import { Logger } from '../core';
import { ObjectUtil } from '../utils';

interface ConfigOptions {
  dotenvPath?: string;
  configSearchPath?: string;
  container?: Container;
  logger?: Logger;
}

type ConfigObj = any;

const debug = Debug('warthog:config');

const CONFIG_VALUE_VALID_KEYS = [
  'allowOptionalIdOnCreate',
  'generatedFolder',
  'cliGeneratePath',
  'moduleImportPath',
  'resolversPath',
  'validateResolvers'
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

type NodeENV = 'development' | 'test' | 'production' | 'none';

@Service('Config')
export class Config {
  readonly WARTHOG_ENV_PREFIX = 'WARTHOG_';
  readonly TYPEORM_ENV_PREFIX = 'TYPEORM_';
  readonly WARTHOG_DB_ENV_PREFIX = 'WARTHOG_DB_';

  defaults: Record<string, any>;
  devDefaults: Record<string, any>;
  prodDefaults: Record<string, any>;
  testDefaults: Record<string, any>;
  PROJECT_ROOT: string;
  container: Container;
  logger?: Logger;
  NODE_ENV?: NodeENV;

  config: ConfigObj;

  constructor(private options: ConfigOptions = {}) {
    this.PROJECT_ROOT = process.cwd();
    this.container = options.container || Container;
    this.logger = options.logger;

    this.defaults = {
      WARTHOG_DB_CONNECTION: 'postgres',
      WARTHOG_ROOT_FOLDER: this.PROJECT_ROOT,
      WARTHOG_ALLOW_OPTIONAL_ID_ON_CREATE: 'false',
      WARTHOG_APP_PROTOCOL: 'https', // DEPRECATED
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
      WARTHOG_DB_URL: '',
      WARTHOG_FILTER_BY_DEFAULT: 'false',
      WARTHOG_MODULE_IMPORT_PATH: 'warthog',
      // TODO: eventually we should do this path resolution when we ask for the variable with `get`
      WARTHOG_GENERATED_FOLDER: path.join(this.PROJECT_ROOT, 'generated'),
      WARTHOG_RESOLVERS_PATH: [path.join(this.PROJECT_ROOT, 'src/**/*.resolver.ts')],
      WARTHOG_SERVICES_PATH: [path.join(this.PROJECT_ROOT, 'src/**/*.service.ts')],
      WARTHOG_SCALARS_PATH: [path.join(this.PROJECT_ROOT, 'src/**/*.scalar.ts')],
      WARTHOG_SUBSCRIPTIONS: 'false',
      WARTHOG_VALIDATE_RESOLVERS: 'false',
      // Prevent 502s from happening in AWS and GCP (and probably other Production ENVs)
      // See https://shuheikagawa.com/blog/2019/04/25/keep-alive-timeout/
      WARTHOG_KEEP_ALIVE_TIMEOUT_MS: 30000,
      WARTHOG_HEADERS_TIMEOUT_MS: 60000,
      WARTHOG_EXPLICIT_ENDPOINT_GENERATION: false
    };

    this.devDefaults = {
      WARTHOG_API_BASE_URL: 'http://localhost:4000',
      WARTHOG_APP_HOST: 'localhost', // DEPRECATED
      WARTHOG_APP_PORT: '4000', // DEPRECATED
      WARTHOG_APP_PROTOCOL: 'http', // DEPRECATED
      WARTHOG_AUTO_GENERATE_FILES: 'true',
      WARTHOG_AUTO_OPEN_PLAYGROUND: 'true',
      WARTHOG_DB_HOST: 'localhost',
      WARTHOG_DB_LOGGING: 'all'
    };

    this.prodDefaults = {
      WARTHOG_DB_ENTITIES: 'dist/src/**/*.model.js',
      WARTHOG_DB_ENTITIES_DIR: 'dist/src/models',
      WARTHOG_DB_SUBSCRIBERS: 'dist/src/**/*.model.js',
      WARTHOG_DB_SUBSCRIBERS_DIR: 'dist/src/subscribers',
      WARTHOG_RESOLVERS_PATH: 'dist/src/**/*.resolver.js',
      WARTHOG_DB_MIGRATIONS: 'dist/db/migrations/**/*.js',
      WARTHOG_DB_MIGRATIONS_DIR: 'dist/db/migrations',
      WARTHOG_SERVICES_PATH: 'dist/src/**/*.service.js'
    };

    this.testDefaults = {
      WARTHOG_API_BASE_URL: 'http://localhost:4000',
      WARTHOG_APP_HOST: 'localhost', // DEPRECATED
      WARTHOG_APP_PORT: '4000', // DEPRECATED
      WARTHOG_APP_PROTOCOL: 'http', // DEPRECATED
      WARTHOG_AUTO_GENERATE_FILES: 'false',
      WARTHOG_AUTO_OPEN_PLAYGROUND: 'false',
      WARTHOG_DB_DATABASE: 'warthog-test',
      WARTHOG_DB_HOST: 'localhost',
      WARTHOG_DB_USERNAME: 'postgres'
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
  determineNodeEnv(dotenvPath: string): NodeENV {
    let nodeEnv = process.env.NODE_ENV as NodeENV;

    const filepath = path.join(dotenvPath, '.env');
    if (fs.existsSync(filepath)) {
      const config = dotenv.parse(fs.readFileSync(filepath));
      if (config.NODE_ENV) {
        nodeEnv = config.NODE_ENV as NodeENV;
      }
    }

    return (this.NODE_ENV = (process.env.NODE_ENV as NodeENV) = nodeEnv);
  }

  loadDotenvFiles(dotenvPath: string) {
    // .local files are for secrets, load those first
    const files = [`.env.local.${this.NODE_ENV}`, '.env.local', '.env'];

    files.forEach((filename: string) => {
      const filepath = path.join(dotenvPath, filename);
      if (fs.existsSync(filepath)) {
        dotenv.config({
          path: filepath
        });
      }
    });
  }

  loadSync(): Config {
    const nodeEnv = this.NODE_ENV as 'development' | 'test' | 'production' | 'none';
    const envDefaults = {
      development: this.devDefaults,
      test: this.testDefaults,
      production: this.prodDefaults,
      none: {}
    }[nodeEnv];

    const configFile = this.loadStaticConfigSync();

    // Config is loaded as a waterfall.  Items at the top of the object are overwritten by those below

    // - Override with locked options
    const combined = {
      ...this.defaults, // - Add application-wide defaults
      ...envDefaults, // - Add environment-specific defaults
      ...configFile, // - Load config from config file
      ...this.typeORMToWarthogEnvVariables(), // - Load TypeORM environment variables if set
      ...this.warthogEnvVariables() // - Load Warthog environment variables
    };

    this.config = this.finalizeConfig(combined);
    debug('Config', this.config);

    // Must be after config is set above
    this.validateEntryExists('WARTHOG_GENERATED_FOLDER');
    this.validateEntryExists('WARTHOG_DB_CONNECTION');
    this.validateEntryExists('WARTHOG_DB_HOST');

    // Now that we've pulled all config in from the waterfall, write `WARTHOG_DB_` keys to `TYPEORM_`
    // So that TypeORM will pick them up
    // this.writeWarthogConfigToTypeORMEnvVars();

    // Once we've combined all of the Warthog ENV vars, write them to process.env so that they can be used elsewhere
    // NOTE: this is likely a bad idea and we should use Containers
    this.writeWarthogEnvVars();

    return this;
  }

  finalizeConfig(config: ConfigObj) {
    // If Jest is running, be smart and don't open playground
    if (typeof process.env.JEST_WORKER_ID !== 'undefined') {
      config.WARTHOG_AUTO_OPEN_PLAYGROUND = 'false';
    }

    const dbUrl = String(config.WARTHOG_DB_URL);
    if (!dbUrl) {
      return config;
    }

    debug(`Using WARTHOG_DB_URL: ${config.WARTHOG_DB_URL}`);

    const pattern = /^(?:([^:/?#\s]+):\/{2})?(?:([^@/?#\s]+)@)?([^/?#\s]+)?(?:\/([^?#\s]*))?(?:[?]([^#\s]+))?\S*$/;
    const matches = dbUrl.match(pattern);
    const params: any = {};

    if (matches && matches.length === 6) {
      const parts = {
        protocol: matches[1],
        user: matches[2] != undefined ? matches[2].split(':')[0] : undefined,
        password: matches[2] != undefined ? matches[2].split(':')[1] : undefined,
        host: matches[3],
        hostname: matches[3] != undefined ? matches[3].split(/:(?=\d+$)/)[0] : undefined,
        port: matches[3] != undefined ? matches[3].split(/:(?=\d+$)/)[1] : undefined,
        database: matches[4] != undefined ? matches[4] : undefined,
        params: params
      };
      if (parts.user) {
        config.WARTHOG_DB_USERNAME = parts.user;
      }
      if (parts.password) {
        config.WARTHOG_DB_PASSWORD = parts.password;
      }
      if (parts.host) {
        config.WARTHOG_DB_HOST = parts.hostname;
      }
      if (parts.port) {
        config.WARTHOG_DB_PORT = parts.port;
      }
      if (parts.database) {
        config.WARTHOG_DB_DATABASE = parts.database;
      }
    }

    return config;
  }

  public getApiBaseUrl() {
    const apiBaseUrl = this.get('API_BASE_URL');
    // Prefer the new API_BASE_URL variable
    if (apiBaseUrl) {
      debug(`Found API_BASE_URL: ${apiBaseUrl}`);
      return apiBaseUrl;
    }

    // Continue to support passing variables as pieces (from v1 and v2)
    return `${this.get('APP_PROTOCOL')}://${this.get('APP_HOST')}:${this.get('APP_PORT')}`;
  }

  public getApiUrl(path?: string) {
    return new URL(path ?? '', this.getApiBaseUrl()).href;
  }

  public getApiPort() {
    const port = new URL('', this.getApiBaseUrl()).port;
    if (port) {
      debug(`Found port from getApiBaseUrl: ${port}`);
      return port;
    } else if (this.get('APP_PORT')) {
      debug(`Found port from get APP_PORT: ${this.get('APP_PORT')}`);
      return this.get('APP_PORT');
    } else {
      debug(`Using default port for NODE_ENV: ${this.NODE_ENV}`);
      return this.NODE_ENV === 'development' ? '80' : '443';
    }

    return;
  }

  public get(key?: string) {
    if (typeof key === 'undefined') {
      return this.config;
    } else if (!key) {
      console.error('Config.get: key cannot be blank');
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
    const explorer = cosmiconfigSync('warthog');

    // Pull config values from cosmiconfig
    const results = explorer.search(this.options.configSearchPath);
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
