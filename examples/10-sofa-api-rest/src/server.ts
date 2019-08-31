import 'reflect-metadata';

import { GraphQLSchema } from 'graphql';
import { useSofa } from 'sofa-api';

import { BaseContext, Server, ServerOptions } from '../../../src';

interface Context extends BaseContext {
  user: {
    email: string;
    id: string;
    permissions: string;
  };
}

export async function getServer(AppOptions: ServerOptions<Context> = {}, dbOptions = {}) {
  const server = new Server<Context>(
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

  await server.buildGraphQLSchema();
  await server.addExpressMiddleware(
    '/api',
    useSofa({
      context: server.contextGetter(),
      schema: server.schema as GraphQLSchema
    })
  );

  return server;
}
