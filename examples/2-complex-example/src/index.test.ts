import { GraphQLError } from 'graphql';
import 'reflect-metadata';

import { Binding } from '../generated/binding';

import { StringEnum, User } from './modules/user/user.model';
import { getServer } from './server';

const server = getServer({}, { logging: false });
let binding: Binding;
let testUser: User;

beforeAll(async done => {
  console.error = jest.fn();

  await server.start();
  binding = ((await server.getBinding()) as unknown) as Binding; // TODO: clean this up

  const key = new Date().getTime();

  testUser = await binding.mutation.createUser(
    {
      data: {
        email: `asdf`,
        firstName: `first ${key}`,
        lastName: `last ${key}`,
        stringEnumField: StringEnum.FOO
      }
    },
    `{ id email firstName lastName }`
  );

  done();
});

afterAll(async done => {
  (console.error as any).mockRestore();
  await server.stop();
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
    const users = await binding.query.users(
      { limit: 1, orderBy: 'createdAt_DESC' },
      `{ id firstName}`
    );

    expect(console.error).not.toHaveBeenCalled();
    expect(users).toBeDefined();
    expect(users.length).toBe(1);
    expect(users[0].id).toBe(testUser.id);
    done();
  });

  test('uniqueness failure', async done => {
    let error: GraphQLError = new GraphQLError('');
    try {
      await binding.mutation.createUser(
        {
          data: {
            email: testUser.email!,
            firstName: testUser.firstName!,
            lastName: testUser.lastName!,
            stringEnumField: StringEnum.FOO
          }
        },
        `{ id email createdAt createdById }`
      );
    } catch (e) {
      error = e as GraphQLError;
    }
    // Note: this test can also surface if you have 2 separate versions of GraphQL installed (which is bad)
    expect(error).toBeInstanceOf(GraphQLError);
    expect(error.message).toContain('duplicate');
    done();
  });
});
