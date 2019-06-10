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

  let binding: Binding;
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
  console.log('project', project);

  let environment;
  try {
    environment = await createEnvironment(binding as any, project.key, 'production');
    console.log('environment', environment);
    environment = await createEnvironment(binding as any, project.key, 'staging');
    console.log('environment', environment);
    environment = await createEnvironment(binding as any, project.key, 'development');
    console.log('environment', environment);
  } catch (err) {
    const error = getBindingError(err);
    console.error(error);
  }

  let segment;
  try {
    segment = await createSegment(binding as any, project.key, environment.key, 'segment-a');
    console.log('segment', segment);
    segment = await createSegment(binding as any, project.key, environment.key, 'segment-b');
    console.log('segment', segment);
    segment = await createSegment(binding as any, project.key, environment.key, 'segment-c');
    console.log('segment', segment);
  } catch (err) {
    const error = getBindingError(err);
    console.error(error);
  }

  try {
    project = await binding.query.project(
      { where: { id: project.id } },
      `{
      id
      name
      createdAt
      environments {
        id
        name
        key
        createdAt
      }
    }`
    );
  } catch (err) {
    const error = getBindingError(err);
    console.error(error);
  }
  console.log(project);

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
        key: `proj-${new Date().getTime()}`,
        name: `Marketplace ${new Date().getTime()}`
      }
    },
    `{ id key name createdAt }`
  );
}

async function createEnvironment(binding: Binding, projKey: string, key: string) {
  const name = `Development`;

  return binding.mutation.createEnvironment(
    {
      data: {
        key,
        name: `${key[0].toUpperCase()}${key.substring(1)}`,
        projKey
      }
    },
    `{ id key name projKey createdAt project { id name key createdAt } }`
  );
}

async function createSegment(binding: Binding, projKey: string, envKey: string, key: string) {
  return binding.mutation.createSegment(
    {
      data: {
        description: 'My First Segment',
        envKey,
        key,
        name: `${key[0].toUpperCase()}${key.substring(1)}`,
        projKey
      }
    },
    `{
      id
      key
      name
      createdAt
      envKey
      environmentId
      environment {
        id
        key
        createdAt
      }
      projKey
      projectId
      project {
        id
        key
        createdAt
      }
    }`
  );
}
