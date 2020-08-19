import { getBindingError, logger } from '@warthog/core';
import * as Faker from 'faker';

import { getServer } from '../src/server';

const NUM_USERS = 100;

async function seedDatabase() {
  const server = getServer({ introspection: true, openPlayground: false });

  // NOTE: this has to be after we instantiate the server, because the server will actually load the environment variables from .env and set process.env.NODE_ENV
  if (process.env.NODE_ENV !== 'development') {
    throw 'Seeding only available in development environment';
  }

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
      logger.info(user.firstName);
    } catch (err) {
      const error = getBindingError(err);
      logger.error(error);
      logger.error(firstName);
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
