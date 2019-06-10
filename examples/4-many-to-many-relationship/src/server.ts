import 'module-alias/register'; // Needed so that we can refer to `warthog` as the import and use the src from this project instead of on NPM
import 'reflect-metadata';

import { Server } from 'warthog';

export function getServer(AppOptions = {}, dbOptions = {}) {
  return new Server(
    {
      introspection: true,
      ...AppOptions
    },
    dbOptions
  );
}
