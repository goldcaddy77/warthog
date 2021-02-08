import { authChecker, Server, ServerOptions } from '../';

// This spins up a mock Warthog server using the models and resolvers in the test/modules directory
export function getTestServer(options: ServerOptions<any> = {}) {
  return new Server({
    authChecker,
    context: () => {
      return {
        user: {
          id: 'abc123',
          permissions: [
            'kitchenSink:create',
            'kitchenSink:read',
            'kitchenSink:update',
            'kitchenSink:delete',
            'dish:create',
            'dish:read',
            'dish:update'
          ]
        }
      };
    },
    introspection: true,
    openPlayground: false,
    connectDBReplica: true,
    ...options
  });
}
