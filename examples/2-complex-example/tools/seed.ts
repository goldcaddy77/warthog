import * as Debug from 'debug';
import * as Faker from 'faker';

import { getServer } from '../src/app';

if (process.env.NODE_ENV !== 'development') {
  throw 'Seeding only available in development environment';
  process.exit(1);
}
const logger = Debug('warthog:seed');

const NUM_USERS = 100;

async function seedDatabase() {
  const app = getServer();
  await app.start();

  const binding = await app.getBinding();

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
            email,
            firstName,
            lastName
          }
        },
        `{ id email createdAt createdById }`
      );
      logger(user.email);
    } catch (error) {
      console.error(email, error);
    }
  }

  return app.stop();
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
