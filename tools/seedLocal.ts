import * as Faker from 'faker';

import { App } from '../src/core';
import { getRemoteBinding } from './binding/remoteBinding';

if (process.env.NODE_ENV !== 'development') {
  throw 'Seeding only available in development environment';
  process.exit(1);
}
// const debug = Debug('api-starter');
const NUM_USERS = 100;

async function seedDatabase() {
  const app = new App({ port: process.env.APP_PORT! });
  await app.start();

  const binding = await getRemoteBinding(`http://${process.env.TYPEORM_HOST}:${process.env.APP_PORT}/graphql`, {
    origin: 'seed-script',
    token: 'faketoken'
  });

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

  app.stop();
}

seedDatabase()
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.error(err);
  });
