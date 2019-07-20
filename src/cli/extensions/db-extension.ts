import * as childProcess from 'child_process';

import { GluegunToolbox } from 'gluegun';
import * as path from 'path';
// @ts-ignore
import * as pgtools from 'pgtools';
import * as util from 'util';
import { Toolbox } from 'gluegun/build/types/domain/toolbox';

const exec = util.promisify(childProcess.exec);

module.exports = (toolbox: GluegunToolbox) => {
  const {
    config: { load },
    print: { error, info }
  } = toolbox;

  toolbox.db = {
    create: async function create(database: string) {
      const config = load();
      validateDevNodeEnv(config['NODE_ENV'], toolbox, 'create');

      const createDb = util.promisify(pgtools.createdb) as Function;

      try {
        await createDb(getPgConfig(config), database);
      } catch (e) {
        if (e.message.indexOf('duplicate') > 0) {
          error(`Database '${database}' already exists`);
          return;
        }
      }
      info(`Database '${database}' created!`);
    },
    drop: async function drop() {
      const config = load();
      validateDevNodeEnv(config['NODE_ENV'], toolbox, 'drop, action: string');

      const database = config.get('DB_DATABASE');
      const dropDb = util.promisify(pgtools.dropdb) as Function;

      try {
        await dropDb(getPgConfig(config), database);
      } catch (e) {
        if (e.name === 'invalid_catalog_name') {
          error(`Database '${database}' does not exist`);
          return;
        }
      }
      info(`Database '${database}' dropped!`);
    },
    migrate: async function migrate() {
      load();

      const result = await runTypeORMCommand('migration:run', toolbox);

      if (result.stderr) {
        error(result.stderr);
      } else {
        info(result.stdout);
      }
    },
    generateMigration: async function generateMigration(name: string) {
      load();

      // Set name to pascal case so that migration class names are pascaled (eslint)
      name = toolbox.strings.pascalCase(name);

      const result = await runTypeORMCommand(
        `migration:generate -n ${name}`,
        toolbox,
        `--dir ./${process.env.WARTHOG_DB_MIGRATIONS_DIR}`
      );

      if (result.stderr) {
        error(result.stderr);
      } else {
        info(result.stdout);
      }
    }
  };
};

async function runTypeORMCommand(command: string, toolbox: Toolbox, additionalParams: string = '') {
  const tsNodePath = path.join(process.cwd(), './node_modules/.bin/ts-node');
  const typeORMPath = path.join(process.cwd(), './node_modules/.bin/typeorm');
  const ormconfigFile = './generated/ormconfig.ts';
  const ormConfigFullPath = path.join(process.cwd(), ormconfigFile);

  if (toolbox.filesystem.isNotFile(ormConfigFullPath)) {
    toolbox.print.error(`Cannot find ormconfig path: ${ormConfigFullPath}`);
    process.exit(1);
  }

  // Ok running this command from within the CLI is finicky
  //
  // 1. For some reason, this command does not work unless you force the --dir in, too.
  //    See https://github.com/typeorm/typeorm/blob/master/src/commands/MigrationGenerateCommand.ts#L52
  //    If you don't pass --dir, then it creates the connectionOptionsReader twice, and for some reason after the first time
  //    it drops settings (specifically the namingStrategy)
  //
  // 2. We need to make sure that all TYPEORM_ environment variables are pulled out of process.env so that
  //    TypeORM doesn't skip loading the ormconfig file
  const cmd = `${tsNodePath} ${typeORMPath} ${command}  --config ${ormconfigFile} ${additionalParams}`;
  const filteredEnv = filteredProcessEnv();
  const result = await exec(cmd, { env: filteredEnv });

  return result;
}

function filteredProcessEnv() {
  const raw = process.env;
  return Object.keys(raw)
    .filter(key => !key.startsWith('TYPEORM_'))
    .reduce((obj: any, key) => {
      obj[key] = raw[key];
      return obj;
    }, {});
}

async function getPgConfig(config: any) {
  return {
    host: config.get('DB_HOST'),
    user: config.get('DB_USERNAME'),
    password: config.get('DB_PASSWORD'),
    port: config.get('DB_PORT')
  };
}

function validateDevNodeEnv(env: string, toolbox: Toolbox, action: string) {
  if (!env) {
    toolbox.print.error('NODE_ENV must be set');
    process.exit(1);
  }
  if (env !== 'development' && process.env.WARTHOG_DB_OVERRIDE !== 'true') {
    toolbox.print.error(
      `Cannot ${action} database without setting WARTHOG_DB_OVERRIDE environment variable to 'true'`
    );
    process.exit(1);
  }
}
