import * as fs from 'fs';
import * as path from 'path';

import { get, GetResponse } from '../../src/core/http';
import { Server } from '../../src/core/server';
import { logger } from '../../src/core/logger';

// import { Binding } from '../../test/generated/binding';
import { getTestServer } from '../test-server';
import { KitchenSink } from '../modules';

let server: Server<any>;
// let binding: Binding;
let binding: any;

describe('server', () => {
  beforeEach(() => {
    jest.setTimeout(20000);
  });

  // Make sure to clean up server
  beforeAll(async done => {
    jest.setTimeout(20000);
    await cleanUpTestData();

    try {
      server = getTestServer({
        apolloConfig: { playground: false }
      });

      await server.start();

      binding = (await server.getBinding()) as unknown;
    } catch (error) {
      logger.error(error);
      process.exit(1);
    }

    const kitchenSink = await createKitchenSink(binding);
    await createDishes(binding, kitchenSink.id);

    done();
  });

  // Make sure to clean up server
  afterAll(async done => {
    await cleanUpTestData();
    await server.stop();
    done();
  });

  it('disables playground properly using apollo config options', async () => {
    const response: GetResponse = await get(server.getGraphQLServerUrl());

    expect(response.statusCode).toEqual(400);
    expect(response.body).toContain('GET query missing');
  });

  it('queries effectively', async () => {
    expect(
      await binding.query.kitchenSinks(
        { skip: 0, orderBy: 'createdAt_DESC', limit: 5 },
        `{
          stringField
          emailField
          integerField
          booleanField
          floatField
          dishes {
            name
          }
          createdById
          updatedById
          version
        }`
      )
    ).toMatchSnapshot();
  });
});

async function createKitchenSink(binding: any): Promise<KitchenSink> {
  return binding.mutation.createKitchenSink(
    {
      data: {
        stringField: 'My String',
        emailField: 'hi@warthog.com',
        integerField: 123,
        booleanField: true,
        floatField: 123.456
      }
    },
    `{ id }`
  );
}

async function createDishes(binding: any, kitchenSinkId: string): Promise<KitchenSink> {
  const data = Array.from({ length: 20 }, (v, i) => i).map(item => {
    return {
      name: `Dish ${item}`,
      kitchenSinkId
    };
  });
  let dishes;

  try {
    dishes = await binding.mutation.createManyDishs({ data }, `{ id name createdById }`);
  } catch (error) {
    logger.error(error);
  }

  return dishes;
}

async function cleanUpTestData() {
  try {
    fs.unlinkSync(path.join(__dirname, '../../warthog.sqlite.tmp'));
  } catch (error) {
    // console.error('Error cleaning up test data', error);
  }

  return;
}
