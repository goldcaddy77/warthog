import { getBindingError } from '@warthog/core';

import { Binding } from '../generated/binding';
import { Logger } from '../src/logger';
import { Environment, FeatureFlag, FeatureFlagUser, Project, Segment } from '../src/models';
import { getServer } from '../src/server';

async function seedDatabase() {
  const server = getServer({ openPlayground: false });

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

  let project: Project;
  // Not doing this in try/catch because the rest of the script complains that it's being used before beind declared otherwise
  project = ((await createProject(binding as any)) as unknown) as Project;

  try {
    // Create environment
    let environment: Environment;
    const environments: Environment[] = [];
    environment = await createEnvironment(binding as any, project.key, 'production');
    environments.push(environment);
    environment = await createEnvironment(binding as any, project.key, 'staging');
    environments.push(environment);
    environment = await createEnvironment(binding as any, project.key, 'development');
    environments.push(environment);

    // Create flags
    await createFeatureFlag(binding as any, project.key, 'alpha-map-view');
    await createFeatureFlag(binding as any, project.key, 'beta-enhanced-nav');
    await createFeatureFlag(binding as any, project.key, 'flag-user-a-specific');
    await createFeatureFlag(binding as any, project.key, 'flag-user-b-specific');

    // Create per-environment items
    for (let i = 0; i < environments.length; i++) {
      const env = environments[i];

      await createSegment(binding, project.key, env.key, 'segment-alpha');
      await createSegment(binding, project.key, env.key, 'segment-beta');
      await createSegment(binding, project.key, env.key, 'segment-c');

      await createUserSegment(binding as any, project.key, env.key, 'user-a', 'segment-alpha');
      await createUserSegment(binding as any, project.key, env.key, 'user-b', 'segment-beta');

      await createFeatureFlagSegment(
        binding as any,
        project.key,
        env.key,
        'alpha-map-view',
        'segment-alpha'
      );
      await createFeatureFlagSegment(
        binding as any,
        project.key,
        env.key,
        'beta-enhanced-nav',
        'segment-beta'
      );

      await createFeatureFlagUser(
        binding as any,
        project.key,
        env.key,
        'flag-user-a-specific',
        'user-a'
      );
      await createFeatureFlagUser(
        binding as any,
        project.key,
        env.key,
        'flag-user-b-specific',
        'user-b'
      );
    }

    Logger.info('QUERYING PROJECT');
    project = await binding.query.project(
      { where: { id: project.id } },
      `{
        id
        key
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
          featureFlagSegments {
            projKey
            envKey
            featureKey
            segmentKey
          }
          userSegments {
            projKey
            envKey
            userKey
            segmentKey
          }
        }
        featureFlags {
          id
          key
          name
          createdAt
          featureFlagUsers {
            projKey
            envKey
            featureKey
            userKey
          }
          featureFlagSegments {
            projKey
            envKey
            featureKey
            segmentKey
          }
        }
        featureFlagUsers {
          id
          projKey
          envKey
          featureKey
          userKey
          user {
            id
            key
            userSegments {
              projKey
              envKey
              userKey
              segmentKey
            }
          }
        }
        featureFlagSegments {
          projKey
          envKey
          featureKey
          segmentKey
        }
        userSegments {
          projKey
          envKey
          userKey
          segmentKey
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
          featureFlagSegments {
            projKey
            envKey
            featureKey
            segmentKey
          }
          userSegments {
            projKey
            envKey
            userKey
            segmentKey
          }
        }
      }`
    );
    Logger.info(project);

    const flagsA = await binding.query.featureFlagsForUser({
      where: { projKey: project.key, envKey: 'production', userKey: 'user-a' }
    });

    Logger.info(flagsA);

    const flagsB = await binding.query.featureFlagsForUser({
      where: { projKey: project.key, envKey: 'production', userKey: 'user-b' }
    });

    Logger.info(flagsB);
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

async function createProject(binding: Binding): Promise<Project> {
  return binding.mutation.createProject(
    {
      data: {
        key: `proj-${new Date().getTime()}`,
        name: `My Project ${new Date().getTime()}`
      }
    },
    `{ id key name createdAt }`
  );
}

async function createEnvironment(
  binding: Binding,
  projKey: string,
  key: string
): Promise<Environment> {
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

async function createFeatureFlag(
  binding: Binding,
  projKey: string,
  key: string
): Promise<FeatureFlag> {
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

async function createUserSegment(
  binding: Binding,
  projKey: string,
  envKey: string,
  userKey: string,
  segmentKey: string
): Promise<FeatureFlagUser> {
  return binding.mutation.createUserSegment(
    {
      data: {
        envKey,
        projKey,
        segmentKey,
        userKey
      }
    },
    `{ id projKey envKey userKey segmentKey createdAt }`
  );
}

async function createFeatureFlagSegment(
  binding: Binding,
  projKey: string,
  envKey: string,
  featureKey: string,
  segmentKey: string
): Promise<FeatureFlagUser> {
  return binding.mutation.createFeatureFlagSegment(
    {
      data: {
        envKey,
        featureKey,
        projKey,
        segmentKey
      }
    },
    `{ id projKey envKey segmentKey featureKey createdAt }`
  );
}

async function createSegment(
  binding: Binding,
  projKey: string,
  envKey: string,
  key: string
): Promise<Segment> {
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
