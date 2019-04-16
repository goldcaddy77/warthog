import 'reflect-metadata';

import { Server } from '../../../src/';

export function getServer(AppOptions = {}) {
  return new Server(
    {
      introspection: true,
      warthogImportPath: '../../../src',
      ...AppOptions
    },
    // Make sure TypeORM does not auto-update the DB schema so that we know our CLI commands
    // are making the changes
    { synchronize: false }
  );
}
