import { WarthogGluegunToolbox } from '../types';

export default {
  name: 'db:create',
  run: async (toolbox: WarthogGluegunToolbox) => {
    const {
      db,
      config: { load }
    } = toolbox;

    const config = load();

    await db.create(config.get('DB_DATABASE'));
  }
};
