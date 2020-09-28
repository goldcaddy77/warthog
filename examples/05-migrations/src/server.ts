import 'reflect-metadata';

import { Server } from 'warthog';

export function getServer(AppOptions = {}) {
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
    // Make sure TypeORM does not auto-update the DB schema so that we know our CLI commands
    // are making the changes
    { synchronize: false }
  );
}
