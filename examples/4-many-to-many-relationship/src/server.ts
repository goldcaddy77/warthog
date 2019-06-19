import 'reflect-metadata';

import { Server } from '../../../src';

export function getServer(AppOptions = {}, dbOptions = {}) {
  return new Server(
    {
      context: () => {
        return {
          user: {
            id: 'abc123'
          }
        };
      },
      introspection: true,
      // Path written in generated classes (only needed because we're in same repo)
      warthogImportPath: '../../../src',
      ...AppOptions
    },
    dbOptions
  );
}
