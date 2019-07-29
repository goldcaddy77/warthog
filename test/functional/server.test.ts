/* eslint-disable @typescript-eslint/camelcase */

import * as fs from 'fs';
import * as path from 'path';

import { get, GetResponse } from '../../src/core/http';
import { Server } from '../../src/core/server';
import { getBindingError, logger } from '../../src';

// import { Binding } from '../../test/generated/binding';
import { getTestServer } from '../test-server';
import { KitchenSink } from '../modules';
import { KITCHEN_SINKS } from './fixtures';

import { setTestServerEnvironmentVariables } from '../server-vars';

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
      setTestServerEnvironmentVariables();

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

  test('queries deeply nested objects', async () => {
    expect.assertions(2);
    const results = await binding.query.kitchenSinks(
      { skip: 0, orderBy: 'createdAt_ASC', limit: 1 },
      `{
          dateField
          stringField
          emailField
          integerField
          booleanField
          floatField
          dishes {
            name
            kitchenSink {
              stringField
            }
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
    expect.assertions(4);

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

    // TODO: this should likely be cleaned up
    expect(improvedError.validationErrors.emailField.isEmail).toEqual(
      'emailField must be an email'
    );

    expect(improvedError.validationErrors).toMatchSnapshot();

    done();
  });

  test('find: string query: exact match (Nakia)', async () => {
    expect.assertions(2);

    const result = await binding.query.kitchenSinks(
      { where: { stringField_eq: 'Nakia' } },
      '{ stringField }'
    );
    expect(result.length).toEqual(1);
    expect(result).toMatchSnapshot();
  });

  test('find: string query: contains `a` (upper or lower)', async () => {
    expect.assertions(2);

    const result = await binding.query.kitchenSinks(
      { where: { stringField_contains: 'a' }, limit: 100 },
      '{ stringField }'
    );
    expect(result.length).toEqual(58);
    expect(result).toMatchSnapshot();
  });

  test('find: string query: starts with `b` (upper or lower)', async () => {
    expect.assertions(2);

    const result = await binding.query.kitchenSinks(
      { where: { stringField_startsWith: 'b' } },
      '{ stringField }'
    );
    expect(result.length).toEqual(5);
    expect(result).toMatchSnapshot();
  });

  test('find: string query: ends with `z` (upper or lower)', async () => {
    expect.assertions(2);

    const result = await binding.query.kitchenSinks(
      { where: { stringField_endsWith: 'z' } },
      '{ stringField }'
    );
    expect(result.length).toEqual(3);
    expect(result).toMatchSnapshot();
  });

  test('find: string query: in list { devin, erling, KAELYN, raquel }', async () => {
    expect.assertions(2);

    const result = await binding.query.kitchenSinks(
      { where: { stringField_in: ['devin', 'erling', 'KAELYN', 'raquel'] } },
      '{ stringField }'
    );
    expect(result.length).toEqual(4);
    expect(result).toMatchSnapshot();
  });

  test('find: integer query: less than 21', async () => {
    expect.assertions(2);

    const result = await binding.query.kitchenSinks(
      { where: { integerField_lt: 21 }, limit: 100 },
      '{ stringField }'
    );
    expect(result.length).toEqual(65);
    expect(result).toMatchSnapshot();
  });

  test('find: integer query: less than or equal to 21', async () => {
    expect.assertions(2);

    const result = await binding.query.kitchenSinks(
      { where: { integerField_lte: 21 }, limit: 100 },
      '{ stringField }'
    );
    expect(result.length).toEqual(66);
    expect(result).toMatchSnapshot();
  });

  test('find: integer query: greater than 21', async () => {
    expect.assertions(2);

    const result = await binding.query.kitchenSinks(
      { where: { integerField_gt: 21 }, limit: 100 },
      '{ stringField }'
    );
    expect(result.length).toEqual(35);
    expect(result).toMatchSnapshot();
  });

  test('find: integer query: greater than or equal to 21', async () => {
    expect.assertions(2);

    const result = await binding.query.kitchenSinks(
      { where: { integerField_gte: 21 }, limit: 100 },
      '{ stringField }'
    );
    expect(result.length).toEqual(36);
    expect(result).toMatchSnapshot();
  });

  test('findOne: consequuntur-94489@a.com', async () => {
    expect.assertions(1);

    let result;
    try {
      result = await binding.query.kitchenSink(
        { where: { emailField: 'consequuntur-94489@a.com' } },
        '{ stringField }'
      );
    } catch (error) {
      throw new Error(error);
    }
    expect(result.stringField).toEqual('Trantow');
  });

  test('Update and Delete', async () => {
    expect.assertions(6);

    // First create a record for the scope of this test
    const email = 'update@warthog.com';
    const returnFields = '{ id, stringField, emailField, integerField, booleanField, floatField }';
    let result;
    try {
      result = await createKitchenSink(binding, email, returnFields);
    } catch (error) {
      throw new Error(error);
    }
    expect(result.stringField).toEqual('My String');

    // Update via unique email field
    try {
      result = await updateKitchenSink(
        binding,
        {
          stringField: 'Updated via Email Field!',
          integerField: 9876,
          booleanField: false
        },
        {
          emailField: email
        }
      );
    } catch (error) {
      throw new Error(error);
    }

    const { id, ...expected } = result;
    expect(expected).toEqual({
      emailField: 'update@warthog.com',
      stringField: 'Updated via Email Field!',
      integerField: 9876,
      booleanField: false,
      floatField: 123.456
    });

    // Update via ID
    try {
      result = await updateKitchenSink(
        binding,
        {
          stringField: 'Updated via ID!',
          integerField: 9876,
          booleanField: false
        },
        {
          emailField: email
        }
      );
    } catch (error) {
      throw new Error(error);
    }

    const { id: _, booleanField, floatField, integerField, ...expected2 } = result;
    expect(expected2).toEqual({
      emailField: 'update@warthog.com',
      stringField: 'Updated via ID!'
    });

    // Delete
    try {
      result = await binding.mutation.deleteKitchenSink({
        where: { emailField: email }
      });
    } catch (error) {
      throw new Error(error);
    }

    expect(result).toBeTruthy();
    expect(result.id).toBeTruthy();

    // Try to find the deleted record
    let error = '';
    try {
      result = await binding.query.kitchenSink({ where: { id: result.id } }, '{ stringField }');
    } catch (err) {
      error = err.message;
    }
    expect(error).toContain('Unable to find KitchenSink where');
  });
});

// where - offset, fields
// create many with a validation error

async function createKitchenSink(
  binding: any,
  email: string,
  returnFields: string = '{ id }'
): Promise<KitchenSink> {
  return binding.mutation.createKitchenSink(
    {
      data: {
        stringField: 'My String',
        dateField: '2019-10-15',
        emailField: email,
        integerField: 123,
        booleanField: true,
        floatField: 123.456
      }
    },
    returnFields
  );
}

async function updateKitchenSink(
  binding: any,
  data: object,
  where: object,
  returnFields: string = '{ id, stringField, emailField, integerField, booleanField, floatField }'
): Promise<KitchenSink> {
  return binding.mutation.updateKitchenSink(
    {
      data,
      where
    },
    returnFields
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
