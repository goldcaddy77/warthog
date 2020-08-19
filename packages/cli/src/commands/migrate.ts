// "db:migration:generate": "yarn typeorm:cli migration:generate -n migration1",
// ts-node ./node_modules/.bin/typeorm -f ./generated/ormconfig.ts

import { WarthogGluegunToolbox } from '../types';

export default {
  name: 'db:migrate',
  run: async (toolbox: WarthogGluegunToolbox) => {
    const {
      db,
      print: { error }
    } = toolbox;

    try {
      await db.migrate();
    } catch (e) {
      error(e);
    }
  }
};
