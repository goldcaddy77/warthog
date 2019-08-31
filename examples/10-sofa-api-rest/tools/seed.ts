import { getBindingError } from '../../../src';

import { Binding } from '../generated/binding';
import { Logger } from '../src/logger';
import { getServer } from '../src/server';

async function seedDatabase() {
  const server = await getServer({ openPlayground: false });

  // NOTE: this has to be after we instantiate the server, because the server will actually load the environment variables from .env and set process.env.NODE_ENV
  if (process.env.NODE_ENV !== 'development') {
    throw 'Seeding only available in development environment';
  }

  await server.start();

  let binding: Binding;
  try {
    binding = ((await server.getBinding()) as unknown) as Binding;
  } catch (error) {
    Logger.error(error);
    return process.exit(1);
  }

  try {
    binding.query;
    // environment = await createEnvironment(binding as any, project.key, 'production');
    // environments.push(environment);
  } catch (err) {
    const error = getBindingError(err);
    Logger.error(error);
  }

  return server.stop();
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
