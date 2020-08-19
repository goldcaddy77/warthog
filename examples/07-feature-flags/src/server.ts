import 'reflect-metadata';

import { BaseContext, Server, ServerOptions } from '@warthog/server-express';

interface Context extends BaseContext {
  user: {
    email: string;
    id: string;
    permissions: string[];
  };
}

export function getServer(AppOptions: ServerOptions<Context> = {}, dbOptions = {}) {
  return new Server<Context>(
    {
      // Inject a fake user.  In a real app you'd parse a JWT to add the user
      context: () => {
        return {
          user: {
            email: 'admin@test.com',
            id: 'abc12345',
            permissions: ['user:read', 'user:update', 'user:create', 'user:delete', 'photo:delete']
          }
        };
      },
      ...AppOptions
    },
    dbOptions
  );
}
