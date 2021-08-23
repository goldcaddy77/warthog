import * as Faker from 'faker';
import { getBindingError, logger } from '../../../src';
import { Binding } from '../generated/binding';
import { getServer } from '../src/server';

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
    try {
      const user = await binding.mutation.createUser(
        {
          data: {
            customGeographyPoint: {
              latitude: Faker.address.latitude(),
              longitude: Faker.address.longitude()
            },
            customGeometryPoint: {
              latitude: Faker.address.latitude(),
              longitude: Faker.address.longitude()
            }
          }
        },
        `{ id customGeographyPoint customGeometryPoint createdAt createdById }`
      );
      logger.info(user);
      const user2 = await binding.query.user({ where: { id: user.id } });
      logger.info(user2);
    } catch (err) {
      const error = getBindingError(err);
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
