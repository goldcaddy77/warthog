import 'reflect-metadata';

import { Server } from '../../../src';

export function getServer(appOptions = {}, dbOptions = {}) {
  return new Server(
    {
      ...appOptions,
      context: () => {
        return {
          user: {
            id: 'abc123'
          }
        };
      }
    },
    dbOptions
  );
}
