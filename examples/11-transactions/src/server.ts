import 'reflect-metadata';

import { Server } from '@warthog/server-express';

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
