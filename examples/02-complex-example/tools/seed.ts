import * as Faker from 'faker';

import { getBindingError, logger } from '../../../src';

import { getServer } from '../src/server';
import { Binding } from '../generated/binding';

const NUM_USERS = 10;

async function seedDatabase() {
  const server = getServer({ openPlayground: false });

  // NOTE: this has to be after we instantiate the server, because the server will actually load the environment variables from .env and set process.env.NODE_ENV
  if (process.env.NODE_ENV !== 'development') {
    throw 'Seeding only available in development environment';
  }

  await server.start();

  let binding: Binding;
  try {
    binding = ((await server.getBinding()) as unknown) as Binding;
  } catch (error) {
    logger.error(error);
    return process.exit(1);
  }

  for (let index = 0; index < NUM_USERS; index++) {
    const random = new Date()
      .getTime()
      .toString()
      .substring(8, 13);
    const stringField = `${Faker.name.firstName()} ${Faker.name.lastName()}`;
    const emailField = `${stringField
      .substring(0, 1)
      .toLowerCase()}${Faker.name.firstName().toLowerCase()}-${random}@fakeemail.com`;

    const jsonField = {
      string: 'hello',
      arrayOfObjects: [{ one: 2 }],
      bool: false,
      number: 1,
      emptyObject: {},
      emptyArray: []
    };
    const dateField = new Date().toISOString();

    try {
      const user = await binding.mutation.createUser(
        {
          data: {
            emailField,
            stringField,
            jsonField,
            dateField,
            enumField: 'FOO',
            geometryField: {
              type: 'Point',
              coordinates: [Faker.random.number(100), Faker.random.number(200)]
            }
          }
        },
        `{ id emailField createdAt createdById }`
      );
      logger.info(user.emailField);
    } catch (err) {
      const error = getBindingError(err);
      logger.error(emailField);
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
