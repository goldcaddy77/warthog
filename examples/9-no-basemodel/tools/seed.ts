import * as Faker from 'faker';

import { Binding } from '../generated/binding';
import { loadConfig } from '../src/config';
import { Logger } from '../src/logger';
import { getServer } from '../src/server';

if (process.env.NODE_ENV !== 'development') {
  throw 'Seeding only available in development environment';
}

async function seedDatabase() {
  // Turn off logging to seed database
  process.env.TYPEORM_LOGGING = 'none';

  loadConfig();

  const server = getServer({ introspection: true, openPlayground: false });
  await server.start();

  let binding: Binding;
  try {
    binding = ((await server.getBinding()) as unknown) as Binding;
  } catch (error) {
    Logger.error(error);

    return process.exit(1);
  }

  let user;
  for (let i = 0; i < 100; i++) {
    try {
      user = await binding.mutation.createUser(
        {
          data: {
            firstName: Faker.name.firstName()
          }
        },
        `{ id firstName }`
      );

      Logger.info(user);
    } catch (error) {
      Logger.logGraphQLError(error);
    }
  }

  return user;
}

seedDatabase()
  .then(result => {
    Logger.info(result);
    return process.exit(0);
  })
  .catch(err => {
    Logger.error(err);
    return process.exit(1);
  });
