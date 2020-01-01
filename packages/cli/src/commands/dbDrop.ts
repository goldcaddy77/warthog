import { WarthogGluegunToolbox } from '../types';

export default {
  name: 'db:drop',
  run: async (toolbox: WarthogGluegunToolbox) => {
    const { db } = toolbox;
    await db.drop();
  }
};
