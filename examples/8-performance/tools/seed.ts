import * as Faker from 'faker';

import { Binding } from '../generated/binding';
import { loadConfig } from '../src/config';
import { Logger } from '../src/logger';
import { User } from '../src/models';
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

  try {
    const user: User = await binding.mutation.createUser(
      {
        data: {
          firstName: 'Test User'
        }
      },
      `{ id firstName }`
    );

    Logger.info(user);

    const BATCH_SIZE = 250;

    let postBuffer: any[] = [];
    let batchNumber = 0;
    for (let i = 0; i < 30_000; i++) {
      postBuffer.push({
        title: Faker.lorem.sentence(5),
        userId: user.id
      });

      if (postBuffer.length >= BATCH_SIZE) {
        Logger.info(`Writing posts batch ${batchNumber++}`);
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
    Logger.logGraphQLError(error);
  }

  return binding.query.posts({ limit: 10 });
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
