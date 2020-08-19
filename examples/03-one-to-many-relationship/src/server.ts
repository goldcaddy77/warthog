import 'reflect-metadata';

import { BaseContext, Server } from '@warthog/server-express';

interface Context extends BaseContext {
  user: {
    email: string;
    id: string;
    permissions: string[];
  };
}

export function getServer(AppOptions = {}, dbOptions = {}) {
  return new Server<Context>(
    {
      // Inject a fake user.  In a real app you'd parse a JWT to add the user
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
