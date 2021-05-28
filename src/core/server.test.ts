import { setTestServerEnvironmentVariables } from '../test/server-vars';
import { getTestServer } from '../test/test-server';
import { createDBConnection } from '../torm';
import { Server, ServerOptions } from './server';

import express = require('express');

describe('Server', () => {
  let server: Server<any>;
  let customExpressApp: express.Application;
  let appListenSpy: jest.SpyInstance;

  beforeEach(() => {
    customExpressApp = express();
    appListenSpy = jest.spyOn(customExpressApp, 'listen');
  });

  // Make sure to clean up server after each test
  afterEach(async done => {
    await server.stop();
    appListenSpy.mockRestore();
    done();
  });

  test('start a server', async () => {
    server = buildServer({});
    await server.start();
    const binding = await server.getBinding();

    expect(binding).toBeTruthy();
    expect(server.schema).toBeTruthy();
    expect(appListenSpy).toHaveBeenCalledTimes(0);
    expect(hasGraphQlRoute(server.expressApp._router)).toBeTruthy();
  });

  test('start a server with a custom express app', async () => {
    const customExpressApp: express.Application = express();
    const appListenSpy = jest.spyOn(customExpressApp, 'listen');
    server = buildServer({ expressApp: customExpressApp });
    await server.start();
    const binding = await server.getBinding();

    expect(binding).toBeTruthy();
    expect(server.schema).toBeTruthy();
    expect(appListenSpy).toHaveBeenCalledTimes(1);
    expect(hasGraphQlRoute(server.expressApp._router)).toBeTruthy();
  });

  test('start a server with a custom DB connection', async () => {
    const testConnectionName = 'custom-test-connection';
    const connection = await createDBConnection({ name: testConnectionName });

    const connectionGetter = () => {
      return Promise.resolve(connection);
    };

    server = buildServer({ connectionGetter });
    await server.start();

    expect(server.getConnection().name).toEqual(testConnectionName);
    expect(server.getConnection()).toEqual(connection);
  });
});

function buildServer(options: ServerOptions<any>): Server<any> {
  setTestServerEnvironmentVariables();
  return getTestServer({
    apolloConfig: { playground: false },
    ...options
  });
}

function hasGraphQlRoute(router: any): boolean {
  return router.stack.find((layer: any) => layer.name === 'query');
}
