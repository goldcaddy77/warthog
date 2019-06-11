import * as Debug from 'debug';
import { getBindingError } from '../../../src';

import { Binding } from '../generated/binding';
import { loadConfig } from '../src/config';
import { Environment, FeatureFlag, FeatureFlagUser, Project, Segment } from '../src/models';
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

  let environment: Environment;
  const environments: Environment[] = [];
  try {
    environment = await createEnvironment(binding as any, project.key, 'production');
    environments.push(environment);
    environment = await createEnvironment(binding as any, project.key, 'staging');
    environments.push(environment);
    environment = await createEnvironment(binding as any, project.key, 'development');
    environments.push(environment);
  } catch (err) {
    const error = getBindingError(err);
    console.error(error);
  }

  try {
    environments.forEach(async (env: Environment) => {
      await createSegmentsForEnvironment(binding as any, project.key, env.key);
    });
  } catch (err) {
    const error = getBindingError(err);
    console.error(error);
  }

  let featureFlag: FeatureFlag;
  const featureFlags: FeatureFlag[] = [];
  try {
    featureFlag = await createFeatureFlag(binding as any, project.key, 'map-view');
    featureFlags.push(featureFlag);
    featureFlag = await createFeatureFlag(binding as any, project.key, 'enhanced-navigation');
    featureFlags.push(featureFlag);
  } catch (err) {
    const error = getBindingError(err);
    console.error(error);
  }

  try {
    for (const env of environments) {
      for (const flag of featureFlags) {
        await createFeatureFlagUsersForEnv(binding as any, project.key, env.key, flag.key);
      }
    }
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
        featureFlagUsers {
          envKey
          featureKey
          userKey
          projKey
        }
      }
      featureFlags {
        id
        key
        name
        createdAt
        featureFlagUsers {
          envKey
          featureKey
          userKey
          projKey
        }
      }
      featureFlagUsers {
        id
        envKey
        featureKey
        userKey
        projKey
      }
      segments {
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
      }
    }`
    );
  } catch (err) {
    const error = getBindingError(err);
    console.error(error);
  }

  console.dir(project, { depth: null });

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

async function createEnvironment(binding: Binding, projKey: string, key: string): Promise<Environment> {
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

async function createFeatureFlag(binding: Binding, projKey: string, key: string): Promise<FeatureFlag> {
  return binding.mutation.createFeatureFlag(
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

async function createFeatureFlagUser(
  binding: Binding,
  projKey: string,
  envKey: string,
  featureKey: string,
  userKey: string
): Promise<FeatureFlagUser> {
  return binding.mutation.createFeatureFlagUser(
    {
      data: {
        envKey,
        featureKey,
        projKey,
        userKey
      }
    },
    `{ id projKey envKey userKey featureKey createdAt }`
  );
}

async function createSegment(binding: Binding, projKey: string, envKey: string, key: string): Promise<Segment> {
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

async function createSegmentsForEnvironment(binding: Binding, projKey: string, envKey: string): Promise<Segment[]> {
  const segments: Segment[] = [];
  let segment: Segment;

  segment = await createSegment(binding, projKey, envKey, 'segment-a');
  // console.log('segment', segment);
  segments.push(segment);
  segment = await createSegment(binding, projKey, envKey, 'segment-b');
  // console.log('segment', segment);
  segments.push(segment);
  segment = await createSegment(binding, projKey, envKey, 'segment-c');
  // console.log('segment', segment);
  segments.push(segment);

  return segments;
}

async function createFeatureFlagUsersForEnv(
  binding: Binding,
  projKey: string,
  envKey: string,
  flagKey: string
): Promise<FeatureFlagUser[]> {
  const featureFlagUsers: FeatureFlagUser[] = [];
  let featureFlagUser: FeatureFlagUser;

  featureFlagUser = await createFeatureFlagUser(binding as any, projKey, envKey, flagKey, 'user-a');
  featureFlagUsers.push(featureFlagUser);
  featureFlagUser = await createFeatureFlagUser(binding as any, projKey, envKey, flagKey, 'user-b');
  featureFlagUsers.push(featureFlagUser);

  return featureFlagUsers;
}
