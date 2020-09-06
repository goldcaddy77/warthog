/* eslint-disable no-console */

import 'reflect-metadata';

import { Binding } from '../generated/binding';
import { User } from './user.model';
import { getServer } from './server';

const server = getServer({}, { logging: false });
const runKey = new Date().getTime();
let binding: Binding;

beforeAll(async done => {
  jest.setTimeout(20000);

  await server.start();
  binding = ((await server.getBinding()) as unknown) as Binding; // TODO: clean this up
  done();
});

afterAll(async done => {
  await server.stop();
  done();
});

describe('Users', () => {
  test('create two users in transaction successfully', async done => {
    expect.assertions(3);
    const FIRSTNAME = `Homer ${runKey}`;

    const users = await binding.mutation.successfulTransaction(
      { data: { firstName: FIRSTNAME, lastName: 'Simpson' } },
      `{ id }`
    );

    expect(users[0]).toBeDefined();
    expect(users[1]).toBeDefined();

    const savedUsers = await binding.query.users({ where: { firstName_eq: FIRSTNAME } }, '{ id }');
    expect(savedUsers.length).toEqual(2);
    done();
  });

  test('failed transaction should not save any items', async done => {
    expect.assertions(1);
    const FIRSTNAME = `Bart ${runKey}`;

    try {
      await binding.mutation.failedTransaction(
        { data: { firstName: FIRSTNAME, lastName: 'Simpson' } },
        `{ id, firstName, lastName }`
      );
    } catch (err) {
      // Swallow the error - we'll check whether anything was saved below
    }

    let savedUsers: User[] = [];
    try {
      savedUsers = await binding.query.users({ where: { firstName_eq: FIRSTNAME } }, '{ id }');
    } catch (error) {
      console.log('This should not have errored', savedUsers);
    }
    expect(savedUsers.length).toEqual(0);
    done();
  });
});

/* eslint-enable no-console */
