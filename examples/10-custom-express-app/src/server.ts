import 'reflect-metadata';

import { Server } from '../../../src';
import express = require('express');

export function getServer(AppOptions = {}, dbOptions = {}) {
  const expressApp: express.Application = express();
  return new Server(
    {
      context: () => {
        return {
          user: {
            id: 'abc123'
          }
        };
      },
      expressApp,
      ...AppOptions
    },
    dbOptions
  );
}
