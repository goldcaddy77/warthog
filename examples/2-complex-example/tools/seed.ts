import * as Debug from 'debug';
import * as Faker from 'faker';

import { getServer } from '../src/server';

if (process.env.NODE_ENV !== 'development') {
  throw 'Seeding only available in development environment';
  process.exit(1);
}
const logger = Debug('warthog:seed');

const NUM_USERS = 100;

async function seedDatabase() {
  const server = getServer({ introspection: true });
  await server.start();

  let binding;
  try {
    binding = await server.getBinding();
  } catch (error) {
    console.error(error);
    return process.exit(1);
  }

  for (let index = 0; index < NUM_USERS; index++) {
    const random = new Date()
      .getTime()
      .toString()
      .substring(8, 13);
    const firstName = Faker.name.firstName();
    const lastName = Faker.name.lastName();
    const email = `${firstName
      .substr(0, 1)
      .toLowerCase()}${lastName.toLowerCase()}-${random}@fakeemail.com`;
    const jsonField = {
      bar: 'hello',
      baz: [{}, { one: 3 }],
      bool: false,
      foo: 1
    };

    try {
      const user = await binding.mutation.createUser(
        {
          data: {
            email,
            firstName,
            jsonField,
            lastName,
            stringEnumField: 'FOO'
          }
        },
        `{ id email createdAt createdById }`
      );
      logger(user.email);
    } catch (error) {
      console.error(email, error);
    }
  }

  return server.stop();
}

seedDatabase()
  .then(result => {
    logger(result);
    return process.exit(0);
  })
  .catch(err => {
    console.log(err);
    return process.exit(1);
  });
