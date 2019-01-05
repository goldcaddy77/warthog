import * as Faker from 'faker';

import { getApp } from '../src/app';

if (process.env.NODE_ENV !== 'development') {
  throw 'Seeding only available in development environment';
  process.exit(1);
}

const NUM_USERS = 100;

async function seedDatabase() {
  let app = getApp();
  await app.generateTypes();
  await app.start();
  const binding = await app.getBinding();

  for (let index = 0; index < NUM_USERS; index++) {
    const random = new Date()
      .getTime()
      .toString()
      .substring(8, 13);
    const firstName = Faker.name.firstName();
    const lastName = Faker.name.lastName();
    const email = `${firstName.substr(0, 1).toLowerCase()}${lastName.toLowerCase()}-${random}@indigoag.com`;

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

      console.log(user.email);
    } catch (error) {
      console.error(email, error);
    }
  }

  return app.stop();
}

seedDatabase()
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.error(err);
  });
