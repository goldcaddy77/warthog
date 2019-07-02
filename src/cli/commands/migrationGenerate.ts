// "db:migration:generate": "yarn typeorm:cli migration:generate -n migration1",
// ts-node ./node_modules/.bin/typeorm -f ./generated/ormconfig.ts

import { WarthogGluegunToolbox } from '../types';

export default {
  name: 'db:migrate:generate',
  run: async (toolbox: WarthogGluegunToolbox) => {
    const {
      db,
      parameters: { options },
      print: { error }
    } = toolbox;

    if (!options.name) {
      error('"name" option is required');
      process.exit(1);
    }

    try {
      await db.generateMigration(options.name);
    } catch (e) {
      error(e);
    }
  }
};
