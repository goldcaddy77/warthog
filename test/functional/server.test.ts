/* eslint-disable @typescript-eslint/camelcase */

import * as fs from 'fs';
import * as path from 'path';
import { isArray } from 'util';

import { get, GetResponse } from '../../src/core/http';
import { Server } from '../../src/core/server';
import { getBindingError, logger } from '../../src';

// import { Binding } from '../../test/generated/binding';
import { getTestServer } from '../test-server';
import { KitchenSink } from '../modules';
import { KITCHEN_SINKS } from './fixtures';

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

    const kitchenSink = await createKitchenSink(binding, 'hi@warthog.com');
    await createManyDishes(binding, kitchenSink.id);
    await createManyKitchenSinks(binding);

    done();
  });

  // Make sure to clean up server
  afterAll(async done => {
    await cleanUpTestData();
    await server.stop();
    done();
  });

  test('disables playground properly using apollo config options', async () => {
    expect.assertions(2);
    const response: GetResponse = await get(server.getGraphQLServerUrl());

    expect(response.statusCode).toEqual(400);
    expect(response.body).toContain('GET query missing');
  });

  test.only('queries deeply nested objects', async () => {
    expect.assertions(2);
    const results = await binding.query.kitchenSinks(
      { skip: 0, orderBy: 'createdAt_ASC', limit: 1 },
      `{
          stringField
          emailField
          integerField
          booleanField
          floatField
          dishes {
            name
            # TODO: why can't we nest 2 levels deep - something broken
            # kitchenSink {
            #   id
            #   stringField
            #  }
          }
          createdById
          updatedById
          version
        }`
    );

    expect(results).toMatchSnapshot();
    expect(results[0].dishes.length).toEqual(20);
  });

  test('throws errors when given bad input', async done => {
    expect.assertions(1);

    createKitchenSink(binding, '')
      .catch(error => {
        expect(error).toBeDefined();
      })
      .finally(done);
  });

  test('getBindingError pulls correct info from binding error', async done => {
    expect.assertions(6);
    let originalError;
    let improvedError;
    try {
      await createKitchenSink(binding, 'not.an.email');
    } catch (err) {
      originalError = err;
      improvedError = getBindingError(err);
    }

    // Ensure that the raw error is useless. If this ever breaks and gives back a lot of
    // useful info, we can get rid of getBindingError and just use the vanilla error
    expect(Object.keys(originalError)).toEqual(['message', 'locations', 'path']);

    // Note: this should likely not be an INTERNAL_SERVER_ERROR since it's based on bad user input
    expect(improvedError.message).toEqual('Argument Validation Error');
    expect(improvedError.path).toEqual(['createKitchenSink']);
    expect(improvedError.extensions.code).toEqual('INTERNAL_SERVER_ERROR');
    expect(isArray(improvedError.extensions.exception.stacktrace)).toBeTruthy();

    // TODO: this should likely be cleaned up
    expect(improvedError.validationErrors.emailField.isEmail).toEqual(
      'emailField must be an email'
    );
    done();
  });

  test('string query: exact match (Nakia)', async () => {
    expect.assertions(2);

    const result = await binding.query.kitchenSinks(
      { where: { stringField_eq: 'Nakia' } },
      '{ stringField }'
    );
    expect(result.length).toEqual(1);
    expect(result).toMatchSnapshot();
  });

  test('string query: contains `a` (upper or lower)', async () => {
    expect.assertions(2);

    const result = await binding.query.kitchenSinks(
      { where: { stringField_contains: 'a' } },
      '{ stringField }'
    );
    expect(result.length).toEqual(50);
    expect(result).toMatchSnapshot();
  });

  test('string query: starts with `b` (upper or lower)', async () => {
    expect.assertions(2);

    const result = await binding.query.kitchenSinks(
      { where: { stringField_startsWith: 'b' } },
      '{ stringField }'
    );
    expect(result.length).toEqual(5);
    expect(result).toMatchSnapshot();
  });

  test('string query: ends with `z` (upper or lower)', async () => {
    expect.assertions(2);

    const result = await binding.query.kitchenSinks(
      { where: { stringField_endsWith: 'z' } },
      '{ stringField }'
    );
    expect(result.length).toEqual(3);
    expect(result).toMatchSnapshot();
  });

  test('string query: in list { devin, erling, KAELYN, raquel }', async () => {
    expect.assertions(2);

    const result = await binding.query.kitchenSinks(
      { where: { stringField_in: ['devin', 'erling', 'KAELYN', 'raquel'] } },
      '{ stringField }'
    );
    expect(result.length).toEqual(4);
    expect(result).toMatchSnapshot();
  });
});

async function createKitchenSink(binding: any, email: string): Promise<KitchenSink> {
  return binding.mutation.createKitchenSink(
    {
      data: {
        stringField: 'My String',
        emailField: email,
        integerField: 123,
        booleanField: true,
        floatField: 123.456
      }
    },
    `{ id }`
  );
}

async function createManyKitchenSinks(binding: any): Promise<KitchenSink> {
  const data = KITCHEN_SINKS.map(item => {
    const { dateField, ...fields } = item; // eslint-disable-line
    return fields;
  });

  return binding.mutation.createManyKitchenSinks({ data }, `{ id }`);
}

async function createManyDishes(binding: any, kitchenSinkId: string): Promise<KitchenSink> {
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

/* eslint-enable @typescript-eslint/camelcase */
