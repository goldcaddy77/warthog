import { WarthogGluegunToolbox } from '../types';

module.exports = {
  name: 'db:drop',
  run: async (toolbox: WarthogGluegunToolbox) => {
    const { db } = toolbox;
    await db.drop();
  }
};
