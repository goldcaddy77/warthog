import 'reflect-metadata';

import { BaseContext, Server } from '../../../src';

import { customLogger } from './logger';

interface Context extends BaseContext {
  user: {
    email: string;
    id: string;
    permissions: string;
  };
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getServer(AppOptions = {}, dbOptions = {}) {
  return new Server<Context>(
    {
      // Inject a fake user.  In a real app you'd parse a JWT to add the user
      context: async () => {
        // allows asynchronous resolution of user (or other items you want to put in context)
        await sleep(500);
        return Promise.resolve({
          user: {
            email: 'admin@test.com',
            id: 'abc12345',
            permissions: ['user:read', 'user:update', 'user:create', 'user:delete', 'photo:delete']
          }
        });
      },
      logger: customLogger,
      ...AppOptions
    },
    dbOptions
  );
}
