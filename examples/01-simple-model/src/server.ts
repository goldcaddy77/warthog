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
      ...AppOptions
    },
    dbOptions
  );
}
