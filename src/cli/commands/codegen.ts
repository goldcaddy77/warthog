import { cleanUpTestData } from '../../db';
import { Server } from '../../';

// BLOG: needed to switch from module.exports because it didn't compile correctly
export default {
  // module.exports = {
  name: 'codegen',
  run: async () => {
    const server = new Server({
      introspection: false,
      mockDBConnection: true
    });

    await server.generateFiles();

    cleanUpTestData();
  }
};
