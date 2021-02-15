import 'reflect-metadata';
import { AdvancedConsoleLogger, Logger, QueryRunner } from 'typeorm';

import { BaseContext, Server } from '../../../src';

interface Context extends BaseContext {
  user: {
    email: string;
    id: string;
    permissions: string;
  };
}

export class CustomLogger extends AdvancedConsoleLogger implements Logger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    if (!queryRunner) {
      return console.log(query);
    }

    console.log(`[${(queryRunner as any).mode}] ${query}`);
  }
}

export function getServer(AppOptions = {}, dbOptions = {}) {
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
    { ...dbOptions, logger: new CustomLogger() }
  );
}
