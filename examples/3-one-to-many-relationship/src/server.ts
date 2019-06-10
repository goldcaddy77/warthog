import 'reflect-metadata';

import { Server } from '../../../src';

export function getServer(AppOptions = {}, dbOptions = {}) {
  return new Server(
    {
      introspection: true,
      ...AppOptions
    },
    dbOptions
  );
}
