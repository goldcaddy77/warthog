import { CodeGenerator } from '../../core/code-generator';
import { loadFromGlobArray } from '../../tgql/loadGlobs';
import { cleanUpTestData } from '../../db';

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

    console.log(config.get());
    loadFromGlobArray(config.get('DB_ENTITIES'));

    try {
      await new CodeGenerator(config.get('GENERATED_FOLDER'), {
        resolversPath: config.get('RESOLVERS_PATH'),
        warthogImportPath: config.get('MODULE_IMPORT_PATH')
      }).generate();
    } catch (error) {
      console.error(error);
    }

    cleanUpTestData();
  }
};
