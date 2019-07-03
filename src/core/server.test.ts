import { getTestServer } from '../../test/test-server';

import { get, GetResponse } from './http';
import { Server } from './server';

let server: Server<any>;

describe('server', () => {
  // Make sure to clean up server
  afterAll(async done => {
    await server.stop();
    done();
  });

  it('disables playground properly using apollo config options', async () => {
    server = getTestServer({
      apolloConfig: { playground: false }
    });

    await server.start();
    const response: GetResponse = await get(server.getGraphQLServerUrl());

    expect(response.statusCode).toEqual(400);
    expect(response.body).toContain('GET query missing');
  });
});
