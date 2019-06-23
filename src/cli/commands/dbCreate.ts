import { WarthogGluegunToolbox } from '../types';

export default {
  name: 'db:create',
  run: async (toolbox: WarthogGluegunToolbox) => {
    const { db } = toolbox;
    await db.create();
  }
};
