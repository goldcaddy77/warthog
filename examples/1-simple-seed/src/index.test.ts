import 'reflect-metadata';
import { GraphQLError } from 'graphql';

import { Binding } from '../generated/binding';

import { getApp } from './app';
import { User } from './modules/user/user.entity';

let app = getApp({}, { logging: false });
let binding: Binding;
let testUser: User;

beforeAll(async done => {
  console.error = jest.fn();

  await app.start();
  binding = ((await app.getBinding()) as unknown) as Binding; // TODO: clean this up

  const key = new Date().getTime();

  testUser = await binding.mutation.createUser(
    {
      data: {
        email: `goldcaddy${key}@gmail.com`,
        firstName: `first ${key}`,
        lastName: `last ${key}`
      }
    },
    `{ id email firstName lastName }`
  );

  done();
});

afterAll(done => {
  (console.error as any).mockRestore();
  app.stop();
  done();
});

describe('Users', () => {
  test('find user by id', async done => {
    const user = await binding.query.user({ where: { id: String(testUser.id) } }, `{ id }`);

    // If user tries to access a private field, it will throw a console error.
    // We should make sure we always fail tests console errors are encountered
    expect(console.error).not.toHaveBeenCalled();
    expect(user).toBeDefined();
    expect(user.id).toBe(testUser.id);
    done();
  });

  test('createdAt sort', async done => {
    let users = await binding.query.users({ limit: 1, orderBy: 'createdAt_DESC' }, `{ id firstName}`);

    expect(console.error).not.toHaveBeenCalled();
    expect(users).toBeDefined();
    expect(users.length).toBe(1);
    expect(users[0].id).toBe(testUser.id);
    done();
  });

  test('uniqueness failure', async done => {
    let error;
    try {
      await binding.mutation.createUser(
        {
          data: {
            email: testUser.email!,
            firstName: testUser.firstName!,
            lastName: testUser.lastName!
          }
        },
        `{ id email createdAt createdById }`
      );
    } catch (e) {
      error = e;
    }

    // Note: this test can also surface if you have 2 separate versions of GraphQL installed (which is bad)
    expect(error).toBeInstanceOf(GraphQLError);
    expect(error.message).toContain('duplicate');
    done();
  });
});
