import * as path from 'path';
import * as fs from 'fs';
import { EntityMetadata } from 'typeorm';

/* eslint-disable @typescript-eslint/camelcase */
import { getBindingError, logger } from '../../';
import { get, GetResponse } from '../../core/http';
import { Server } from '../../core/server';

import { Binding, KitchenSinkWhereInput } from '../generated/binding';
import { KitchenSink, StringEnum, Dish } from '../modules';
import { getTestServer } from '../test-server';

import { KITCHEN_SINKS } from './fixtures';
import { callAPIError, callAPISuccess } from '../utils';

import express = require('express');
import * as request from 'supertest';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { EncodingService } from '../../core/encoding';

let runKey: string;
let server: Server<any>;
// Can't type this as Binding as TypeScript will do static analysis and bomb if any new fields are introduced
let binding: Binding;
let customExpressApp: express.Application;

let onBeforeCalled = false;
let onAfterCalled = false;
let kitchenSink: KitchenSink;

describe('server', () => {
  // Make sure to clean up server
  beforeAll(async done => {
    // setTestServerEnvironmentVariables();

    runKey = String(new Date().getTime()); // used to ensure test runs create unique data

    // build a custom express app with a dummy endpoint
    customExpressApp = buildCustomExpressApp();

    try {
      // TODO: before you attempt to start the server, we need to generate the code so that we don't get TS compiler issues

      server = getTestServer({
        apolloConfig: { playground: false },
        expressApp: customExpressApp,
        onBeforeGraphQLMiddleware: (app: express.Application) => {
          app;
          onBeforeCalled = true;
        },
        onAfterGraphQLMiddleware: (app: express.Application) => {
          app;
          onAfterCalled = true;
        }
      });

      await server.start();

      binding = ((await server.getBinding()) as unknown) as Binding;
    } catch (error) {
      logger.error(error);
      throw new Error(error);
    }

    // sinksExist skips recreating seed data so that we can re-run tests in watch mode
    const sinksExist = (await binding.query.kitchenSinks({ limit: 1 }, '{ id }')).length > 0;
    if (!sinksExist) {
      kitchenSink = await createKitchenSink(binding, 'hi@warthog.com');
      await createManyDishes(binding, kitchenSink.id);
      await createManyKitchenSinks(binding);
    }

    done();
  });

  // Make sure to clean up server
  afterAll(async done => {
    await server.stop();
    done();
  });

  test('before and after middleware hooks called', async () => {
    expect(onBeforeCalled).toEqual(true);
    expect(onAfterCalled).toEqual(true);
  });

  test('disables playground properly using apollo config options', async () => {
    expect.assertions(2);
    const response: GetResponse = await get(server.getGraphQLServerUrl());

    expect(response.statusCode).toEqual(400);
    expect(response.body).toContain('GET query missing');
  });

  // Previously, dataloader bombed out if you didn't ask for id, because postgres didn't
  // return it and we couldn't batch IDs to query lower
  test('queries deeply nested objects without an ID', async () => {
    expect.assertions(2);
    const results = await binding.query.kitchenSinks(
      { offset: 0, orderBy: 'createdAt_ASC', limit: 1 },
      `{
          dateField
          jsonField
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
    const firstResult = (results[0] as unknown) as KitchenSink;

    expect(firstResult.dishes.length).toEqual(20);
  });

  test('queries for dishes with pagination', async () => {
    const { totalCount, edges, pageInfo } = await callAPISuccess(
      binding.query.dishConnection(
        { orderBy: 'name_ASC', first: 1 },
        `{
            totalCount
            edges {
              node {
                name
                kitchenSink {
                  emailField
                }
              }
              cursor
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }`
      )
    );

    const encodingService = new EncodingService();
    const decodedCursor: [string, string] = encodingService.decode(edges[0].cursor);

    expect(decodedCursor[0]).toMatch(/Dish [0-9]+/);
    expect(decodedCursor[1]).toMatch(/[A-Za-z0-9_-]{7,14}/);
    expect(edges[0].node.name).toBeTruthy();
    expect(edges[0].node.kitchenSink.emailField).toBeTruthy();
    expect(pageInfo.hasNextPage).toEqual(true);
    expect(pageInfo.hasPreviousPage).toEqual(false);
    expect(totalCount).toEqual(20);
  });

  test.skip('Does not perform expensive totalCount operation if not needed', async () => {
    //
  });

  test('throws errors when given bad input on a single create', async done => {
    expect.assertions(1);

    createKitchenSink(binding, '').catch(error => {
      expect(error).toHaveProperty('message', 'Argument Validation Error\n');
      done();
    });
  });

  test('throws errors when given bad input on a many create', async done => {
    expect.assertions(1);
    const sink = {
      dateField: '2000-03-26T19:39:08.597Z',
      stringField: 'Trantow',
      emailField: '',
      integerField: 41,
      booleanField: false,
      floatField: -1.3885,
      stringEnumField: StringEnum.BAR
    };

    createManyKitchenSinks(binding, [sink]).catch((error: Error) => {
      expect(error).toHaveProperty('message', 'Argument Validation Error\n');
      done();
    });
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

  test('find: allows client to ask for __typename', async () => {
    expect.assertions(2);

    const result = await binding.query.kitchenSinks({ limit: 1 }, '{ __typename }');
    expect(result.length).toEqual(1);
    expect(result).toMatchSnapshot();
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

  test('find: string query: contains `A` (upper or lower)', async () => {
    expect.assertions(2);

    const result = await binding.query.kitchenSinks(
      { where: { stringField_contains: 'A' }, limit: 100 },
      '{ stringField }'
    );

    expect(result.length).toEqual(58);
    expect(result).toMatchSnapshot();
  });

  test('find: string query: starts with `b` (upper or lower)', async () => {
    expect.assertions(2);

    const result = await binding.query.kitchenSinks(
      { where: { stringField_startsWith: 'B' } },
      '{ stringField }'
    );
    expect(result.length).toEqual(5);
    expect(result).toMatchSnapshot();
  });

  test('find: string query: ends with `z` (upper or lower)', async () => {
    expect.assertions(2);

    const result = await binding.query.kitchenSinks(
      { where: { stringField_endsWith: 'Z' } },
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

  test('find: enum field = BAR', async () => {
    expect.assertions(2);

    const result = await binding.query.kitchenSinks(
      { where: { stringEnumField_eq: StringEnum.BAR }, limit: 100 },
      '{ stringField }'
    );
    expect(result.length).toEqual(56);
    expect(result).toMatchSnapshot();
  });

  test('find: dateOnlyField greater than or equal 2020-01-01', async () => {
    expect.assertions(3);

    const result = await binding.query.kitchenSinks(
      { where: { dateOnlyField_gte: '2020-01-01' }, limit: 100 },
      '{ stringField dateOnlyField }'
    );

    expect(result.length).toEqual(30);
    expect(result[0].dateOnlyField!.length).toBe(10);
    expect(result).toMatchSnapshot();
  });

  test('find: dateTimeField less than or equal 2020-01-01', async () => {
    const result = await binding.query.kitchenSinks(
      { where: { dateTimeField_lte: '2020-01-01' }, limit: 100 },
      '{ stringField dateTimeField }'
    );

    expect(result.length).toEqual(69);
    expect(result[0].dateTimeField!.length).toBe(24);
    expect(result).toMatchSnapshot();
  });

  test('find: jsonField foo_eq: bar', async () => {
    const result = await binding.query.kitchenSinks(
      { where: { jsonField_json: { foo_eq: 'bar' } }, limit: 100 },
      '{ stringField jsonField }'
    );

    expect(result.length).toEqual(29);
    expect(result).toMatchSnapshot();
  });

  test('find: arrayOfInts_containsAll: [1, 2, 7]', async () => {
    const result = await binding.query.kitchenSinks(
      { where: { arrayOfInts_containsAll: [1, 2, 7] }, limit: 100 },
      '{ stringField arrayOfInts }'
    );

    expect(result.length).toEqual(1);
    expect(result).toMatchSnapshot();
  });

  test('find: arrayOfInts_containsAny: [1, 2, 7]', async () => {
    const result = await binding.query.kitchenSinks(
      { where: { arrayOfInts_containsAny: [1, 2, 7] }, limit: 100 },
      '{ stringField arrayOfInts }'
    );

    expect(result.length).toEqual(46);
    expect(result).toMatchSnapshot();
  });

  test('find: arrayOfInts_containsNone: [1, 2, 7]', async () => {
    const result = await binding.query.kitchenSinks(
      { where: { arrayOfInts_containsNone: [1, 2, 7] }, limit: 100 },
      '{ stringField arrayOfInts }'
    );

    expect(result.length).toEqual(54);
    expect(result).toMatchSnapshot();
  });

  test('find: arrayOfStrings_containsAll: [dog, cat]', async () => {
    const result = await binding.query.kitchenSinks(
      { where: { arrayOfStrings_containsAll: ['dog', 'cat'] }, limit: 100 },
      '{ stringField arrayOfStrings }'
    );

    expect(result.length).toEqual(3);
    expect(result).toMatchSnapshot();
  });

  test('find: arrayOfStrings_containsAny: [dog, cat]', async () => {
    const result = await binding.query.kitchenSinks(
      { where: { arrayOfStrings_containsAny: ['dog', 'cat'] }, limit: 100 },
      '{ stringField arrayOfStrings }'
    );

    expect(result.length).toEqual(29);
    expect(result).toMatchSnapshot();
  });

  test('find: arrayOfStrings_containsNone: [dog, cat]', async () => {
    const result = await binding.query.kitchenSinks(
      { where: { arrayOfStrings_containsNone: ['dog', 'cat'] }, limit: 100 },
      '{ stringField arrayOfStrings }'
    );

    expect(result.length).toEqual(71);
    expect(result).toMatchSnapshot();
  });

  //
  //

  // jsonField: {
  //   foo: 'bar',
  //   quia: 'autem'
  // },
  // arrayOfInts: [1],
  // arrayOfStrings: []

  //
  //

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

  test('Use 2 different operators on same attribute', async () => {
    expect.assertions(3);
    let result;
    try {
      const where: KitchenSinkWhereInput = {
        stringField_endsWith: 'w',
        stringField_contains: 'a'
      };
      result = await binding.query.kitchenSinks({ limit: 100, where }, '{ stringField }');
    } catch (error) {
      throw new Error(error);
    }

    expect(result.length).toEqual(1);
    expect(result[0].stringField).toEqual('Trantow');
    expect(result).toMatchSnapshot();
  });

  test('Update and Delete', async () => {
    expect.assertions(12);

    // First create a record for the scope of this test
    const email = 'update@warthog.com';
    const returnFields = '{ id, stringField, emailField, integerField, booleanField, floatField }';
    let sink;
    let result;
    try {
      sink = await createKitchenSink(binding, email, returnFields);
    } catch (error) {
      throw new Error(error);
    }
    expect(sink.stringField).toEqual('My String');

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

    // Get error when trying to find a single deleted item by ID
    let error = '';
    try {
      result = await binding.query.kitchenSink({ where: { id: sink.id } }, '{ stringField }');
    } catch (err) {
      error = err.message;
    }
    expect(error).toContain('Unable to find KitchenSink where');

    // Get no results when trying to find deleted record by ID
    try {
      result = await binding.query.kitchenSinks({ where: { id_eq: sink.id } }, '{ stringField }');
      expect(result).toBeTruthy();
      expect(result.length).toEqual(0);
    } catch (err) {
      error = err.message;
    }

    // Able to find deleted record with list endpoint and deletedAt_all specified
    try {
      result = await binding.query.kitchenSinks(
        { where: { id_eq: sink.id, deletedAt_all: true } },
        '{ stringField }'
      );

      expect(result).toBeTruthy();
      expect(result.length).toEqual(1);
    } catch (err) {
      error = err.message;
    }

    // Able to find deleted record with deletedAt_gt
    try {
      result = await binding.query.kitchenSinks(
        { where: { deletedAt_gt: '2000-01-01' } },
        '{ stringField }'
      );

      expect(result).toBeTruthy();
      expect(result.length).toEqual(1);
    } catch (err) {
      error = err.message;
    }
  });

  test('Send request to /foo via passed in custom express app', async () => {
    expect.assertions(5);
    const response: request.Response = await request(customExpressApp)
      .get('/foo')
      .send();

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ bar: 'baz' });
    noSupertestRequestErrors(response);
  });

  test("Send request to /foo via server's exposed express app", async () => {
    expect.assertions(5);
    const response: request.Response = await request(server.expressApp)
      .get('/foo')
      .send();

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ bar: 'baz' });
    noSupertestRequestErrors(response);
  });

  describe('Transactions', () => {
    test('create two dishes in transaction successfully', async done => {
      expect.assertions(5);
      const name = `Tx Success ${runKey}`;

      const users = await callAPISuccess(
        binding.mutation.successfulTransaction(
          { data: { name, kitchenSinkId: kitchenSink.id } },
          `{ id name }`
        )
      );

      expect(users[0]).toBeDefined();
      expect(users[0].name).toBe(name);

      expect(users[1]).toBeDefined();
      expect(users[1].name).toBe(`${name} Updated`);

      const savedDishes = await binding.query.dishes({ where: { name_contains: name } }, '{ id }');
      expect(savedDishes.length).toEqual(2);
      done();
    });

    test('failed transaction should not save any items', async done => {
      expect.assertions(2);
      const name = `Tx Fail ${runKey}`;

      const result = await callAPIError(
        binding.mutation.failedTransaction(
          { data: { name, kitchenSinkId: kitchenSink.id } },
          `{ id name }`
        )
      );

      expect(result.message).toBe('null value in column "name" violates not-null constraint');

      let savedDishes: Dish[] = [];
      try {
        savedDishes = await binding.query.dishes({ where: { name_eq: name } }, '{ id }');
      } catch (error) {
        console.error('This should not have errored', savedDishes);
      }
      expect(savedDishes.length).toEqual(0);
      done();
    });
  });

  describe('DB Decorator options', () => {
    let kitchenSinkDBColumns: string[];
    let stringFieldColumn: ColumnMetadata;
    beforeEach(() => {
      const kitchenSinkTableMeta = server.connection.entityMetadatas.find(
        entity => entity.name === 'KitchenSink'
      ) as EntityMetadata;

      if (!kitchenSinkTableMeta) {
        throw new Error('Expected to find the KitchenSink TypeORM metadata');
      }

      kitchenSinkDBColumns = kitchenSinkTableMeta.columns.map(column => column.propertyName);

      stringFieldColumn = kitchenSinkTableMeta.columns.find(
        column => column.propertyName === 'stringField'
      ) as ColumnMetadata;
    });

    test('apiOnly column does not exist in the DB', async done => {
      expect(kitchenSinkDBColumns).not.toContain('apiOnlyField');
      done();
    });

    test('dbOnly column does exist in the DB', async done => {
      expect(kitchenSinkDBColumns).toContain('dbOnlyField');
      done();
    });

    // TypeORM comment support is currently broken
    // See: https://github.com/typeorm/typeorm/issues/5906
    test.skip('description maps to comment DB metadata', async done => {
      expect(stringFieldColumn.comment).toEqual('This is a string field');
      done();
    });
  });

  describe('ApiOnly Model', () => {
    let apiOnlyEntityMeta: EntityMetadata;
    beforeEach(() => {
      apiOnlyEntityMeta = server.connection.entityMetadatas.find(
        entity => entity.name === 'ApiOnly'
      ) as EntityMetadata;
    });

    test('Does not exist in the DB', async done => {
      expect(apiOnlyEntityMeta).toBeFalsy();
      done();
    });

    test('Does exist in the API schema', () => {
      const file = path.join(__dirname, '..', 'generated', 'schema.graphql');
      const schema = fs.readFileSync(file, 'utf-8');

      expect(schema).toContain('ApiOnly');
      expect(schema).toContain('ApiOnlyWhereInput');
    });
  });

  describe('CustomField Validations', () => {
    let kitchenSinkDBColumns: string[];
    beforeEach(() => {
      const kitchenSinkTableMeta = server.connection.entityMetadatas.find(
        entity => entity.name === 'KitchenSink'
      ) as EntityMetadata;

      if (!kitchenSinkTableMeta) {
        throw new Error('Expected to find the KitchenSink TypeORM metadata');
      }

      kitchenSinkDBColumns = kitchenSinkTableMeta.columns.map(column => column.propertyName);
    });

    describe('readonly flag', () => {
      test('readonly column does exist in the DB', async done => {
        expect(kitchenSinkDBColumns).toContain('customTextFieldReadOnly');
        done();
      });

      test('readonly column exists once in the schema (on the KitchenSink model)', () => {
        const file = path.join(__dirname, '..', 'generated', 'schema.graphql');
        const schema = fs.readFileSync(file, 'utf-8');

        const re = /customTextFieldReadOnly/g;
        const numberOfInstances = ((schema || '').match(re) || []).length;
        expect(schema).toContain('customTextFieldReadOnly');
        expect(numberOfInstances).toEqual(1);
      });
    });
  });
});

async function createKitchenSink(
  binding: any,
  email: string,
  returnFields = '{ id }'
): Promise<KitchenSink> {
  return binding.mutation.createKitchenSink(
    {
      data: {
        booleanField: true,
        dateField: '2019-10-15',
        emailField: email,
        floatField: 123.456,
        integerField: 123,
        // TODO: for some reason this is getting added as NULL
        jsonField: { hello: 'world' },
        stringField: 'My String',
        customTextFieldNoSortOrFilter: 'text field text field text field'
      }
    },
    returnFields
  );
}

async function updateKitchenSink(
  binding: any,
  data: object,
  where: object,
  returnFields = '{ id, stringField, emailField, integerField, booleanField, floatField }'
): Promise<KitchenSink> {
  return binding.mutation.updateKitchenSink(
    {
      data,
      where
    },
    returnFields
  );
}

async function createManyKitchenSinks(binding: any, data = KITCHEN_SINKS): Promise<KitchenSink> {
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

function buildCustomExpressApp() {
  const app = express();
  app.get('/foo', (req: express.Request, res: express.Response) => {
    res.status(200).json({ bar: 'baz' });
  });
  return app;
}

function noSupertestRequestErrors(result: request.Response) {
  expect(result.error).toBe(false);
  expect(result.clientError).toBe(false);
  expect(result.serverError).toBe(false);
}
