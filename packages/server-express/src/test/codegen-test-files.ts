import { Config, CodeGenerator, logger } from '@warthog/core';

process.env.WARTHOG_GENERATED_FOLDER = './src/test/generated';
process.env.WARTHOG_RESOLVERS_PATH = './src/test/modules/**/*.ts';
process.env.WARTHOG_DB_ENTITIES = './src/test/modules';
process.env.WARTHOG_MODULE_IMPORT_PATH = '../../';

logger.error(Config);
const config = new Config();

async function run() {
  return new CodeGenerator(config.get('GENERATED_FOLDER'), config.get('DB_ENTITIES'), {
    resolversPath: config.get('RESOLVERS_PATH'),
    validateResolvers: config.get('VALIDATE_RESOLVERS') === 'true',
    warthogImportPath: config.get('MODULE_IMPORT_PATH')
  }).generate();
}

run()
  .then(console.log) // eslint-disable-line
  .catch(console.error); // eslint-disable-line
