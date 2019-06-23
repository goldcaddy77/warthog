import { Server } from '../../../src';

module.exports = {
  name: 'codegen',
  run: async () => {
    const server = new Server({
      introspection: false,
      mockDBConnection: true,
      warthogImportPath: '../../../src'
    });

    return server.generateFiles();
  }
};
