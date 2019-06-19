import 'reflect-metadata';

import { BaseContext, Server } from '../../../src';

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
      context: () => {
        return {
          user: {
            id: 'abc12345'
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
