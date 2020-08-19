import { logger, CodeGenerator, cleanUpTestData } from '@warthog/core';

import { WarthogGluegunToolbox } from '../types';

// BLOG: needed to switch from module.exports because it didn't compile correctly
export default {
  // module.exports = {
  name: 'codegen',
  run: async (toolbox: WarthogGluegunToolbox) => {
    const {
      config: { load }
    } = toolbox;

    const config = load();

    try {
      await new CodeGenerator(config.get('GENERATED_FOLDER'), config.get('DB_ENTITIES'), {
        resolversPath: config.get('RESOLVERS_PATH'),
        validateResolvers: config.get('VALIDATE_RESOLVERS') === 'true',
        warthogImportPath: config.get('MODULE_IMPORT_PATH')
      }).generate();
    } catch (error) {
      logger.error(error);
      if (error.name.indexOf('Cannot determine GraphQL input type') > -1) {
        logger.error('This often means you have multiple versions of TypeGraphQL installed.');
      }
    }
  }
};
