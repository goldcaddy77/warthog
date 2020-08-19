import * as Faker from 'faker';

import { getBindingError, logger } from '@warthog/core';

import { getServer } from '../src/server';

if (process.env.NODE_ENV !== 'development') {
  throw 'Seeding only available in development environment';
}

const NUM_USERS = 10;

async function seedDatabase() {
  const server = getServer({ openPlayground: false });
  await server.start();

  let binding;
  try {
    binding = await server.getBinding();
  } catch (error) {
    logger.error(error);
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

    try {
      const user = await binding.mutation.createUser(
        {
          data: {
            age: Faker.random.number({ min: 10, max: 100 }),
            email,
            firstName,
            isRequired: Faker.random.arrayElement([true, false]),
            lastName,
            rating: Faker.random.number({ min: 1, max: 5 }),
            stringEnumField: Faker.random.arrayElement(['FOO', 'BAR'])
          }
        },
        `{ id email createdAt createdById }`
      );
      logger.info(user.email);
    } catch (err) {
      const error = getBindingError(err);
      logger.error(email);
      logger.error(error);
    }
  }

  return server.stop();
}

seedDatabase()
  .then(result => {
    logger.info(result);
    return process.exit(0);
  })
  .catch(err => {
    logger.error(err);
    return process.exit(1);
  });
