import * as Debug from 'debug';
import * as Faker from 'faker';

import { loadConfig } from '../src/config';
import { getServer } from '../src/server';

if (process.env.NODE_ENV !== 'development') {
  throw 'Seeding only available in development environment';
  process.exit(1);
}
const logger = Debug('warthog:seed');

const NUM_USERS = 100;

async function seedDatabase() {
  loadConfig();

  const server = getServer({ introspection: true, openPlayground: false });
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
    const firstName = `Faker.name.firstName() ${random}`;
    const lastName = Faker.name.lastName();

    try {
      const user = await binding.mutation.createUser(
        {
          data: {
            firstName,
            lastName
          }
        },
        `{ id firstName lastName createdAt createdById }`
      );
      logger(user.firstName);
    } catch (error) {
      console.error(firstName, error);
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
