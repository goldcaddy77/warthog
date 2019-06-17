import * as Debug from 'debug';
import * as Faker from 'faker';

import { Binding } from '../generated/binding';
import { loadConfig } from '../src/config';
import { logger } from '../src/logger';
import { User } from '../src/models';
import { getServer } from '../src/server';

if (process.env.NODE_ENV !== 'development') {
  throw 'Seeding only available in development environment';
  process.exit(1);
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
    console.error(error);

    return process.exit(1);
  }

  try {
    const user: User = await binding.mutation.createUser(
      {
        data: {
          firstName: 'Test User'
        }
      },
      `{ id firstName }`
    );

    console.log(user);

    const BATCH_SIZE = 250;

    // tslint:disable-next-line:prefer-for-of
    let postBuffer: any[] = [];
    let batchNumber = 0;
    for (let i = 0; i < 30_000; i++) {
      postBuffer.push({
        title: Faker.lorem.sentence(5),
        userId: user.id
      });

      if (postBuffer.length >= BATCH_SIZE) {
        console.log(`Writing posts batch ${batchNumber++}`);
        await binding.mutation.createManyPosts(
          {
            data: postBuffer
          },
          `{ id title }`
        );
        postBuffer = [];
      }
    }
  } catch (error) {
    logger.logGraphQLError(error);
  }

  return binding.query.posts({ limit: 10 });
}

seedDatabase()
  .then(result => {
    logger.log(result);
    return process.exit(0);
  })
  .catch(err => {
    console.log(err);
    return process.exit(1);
  });
