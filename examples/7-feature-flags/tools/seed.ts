import * as Debug from 'debug';
import { getBindingError } from '../../../src';

import { Binding } from '../generated/binding';
import { loadConfig } from '../src/config';
import { Project } from '../src/project/project.model';
import { getServer } from '../src/server';

if (process.env.NODE_ENV !== 'development') {
  throw 'Seeding only available in development environment';
  process.exit(1);
}
const logger = Debug('warthog:seed');

async function seedDatabase() {
  loadConfig();

  const server = getServer({ introspection: true, openPlayground: false });
  await server.start();

  let binding: any;
  try {
    binding = ((await server.getBinding()) as unknown) as Binding;
  } catch (error) {
    console.error(error);
    return process.exit(1);
  }

  // Hmmm, not sure why I have to do this
  let project: Project = (null as unknown) as Project;
  try {
    project = ((await createProject(binding as any)) as unknown) as Project;
  } catch (err) {
    const error = getBindingError(err);
    console.error(error);
  }

  let environment;
  try {
    environment = await createEnvironment(binding as any, `Foo ${project.id}`, 'production');
  } catch (err) {
    const error = getBindingError(err);
    console.error(error);
  }
  console.log(environment);

  return server.stop();
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

async function createProject(binding: Binding): Promise<Project> {
  return binding.mutation.createProject(
    {
      data: {
        key: `mkt-${new Date().getTime()}`,
        name: `Marketplace ${new Date().getTime()}`
      }
    },
    `{ id key name createdAt }`
  );
}

async function createEnvironment(binding: Binding, project: string, strName: string) {
  const key = `key-${project}`;
  const name = `Development ${strName} ${new Date().getTime()}`;

  console.log(key, name);

  return binding.mutation.createEnvironment(
    {
      data: {
        key,
        name
      }
    },
    `{ id key name createdAt }`
  );
}
