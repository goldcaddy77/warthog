import { WarthogGluegunToolbox } from '../types';

module.exports = {
  name: 'db:create',
  run: async (toolbox: WarthogGluegunToolbox) => {
    const { db } = toolbox;
    await db.create();
  }
};
