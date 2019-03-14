import 'reflect-metadata';

import { BaseContext, Server } from '../../../src/';

import { customLogger } from './logger';

interface Context extends BaseContext {
  user: {
    email: string;
    id: string;
    permissions: string;
  };
}

export function getServer(AppOptions = {}, dbOptions = {}) {
  return new Server<Context>(
    {
      // Inject a fake user.  In a real app you'd parse a JWT to add the user
      context: request => {
        return {
          user: {
            email: 'admin@test.com',
            id: 'abc12345',
            permissions: ['user:read', 'user:update', 'user:create', 'user:delete', 'photo:delete']
          }
        };
      },
      logger: customLogger,
      // Path written in generated classes (only needed because we're in same repo)
      warthogImportPath: '../../../src',
      ...AppOptions
    },
    dbOptions
  );
}
