import 'reflect-metadata';

import { Server } from '@warthog/core';

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
      ...AppOptions
    },
    dbOptions
  );
}
