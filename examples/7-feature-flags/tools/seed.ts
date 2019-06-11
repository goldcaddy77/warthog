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
    let featureFlag: FeatureFlag;
    const featureFlags: FeatureFlag[] = [];
    featureFlag = await createFeatureFlag(binding as any, project.key, 'map-view');
    featureFlags.push(featureFlag);
    featureFlag = await createFeatureFlag(binding as any, project.key, 'enhanced-navigation');
    featureFlags.push(featureFlag);

    // Create per-environment items
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < environments.length; i++) {
      const env = environments[i];
      const segments = await createSegmentsForEnvironment(binding as any, project.key, env.key);

      // tslint:disable-next-line:prefer-for-of
      for (let l = 0; l < segments.length; l++) {
        const segment = segments[l];

        await createUserSegment(binding as any, project.key, env.key, 'user-a', segment.key);
        await createUserSegment(binding as any, project.key, env.key, 'user-b', segment.key);
      }

      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < featureFlags.length; j++) {
        const flag = featureFlags[j];

        await createFeatureFlagUser(binding as any, project.key, env.key, flag.key, 'user-a');
        await createFeatureFlagUser(binding as any, project.key, env.key, flag.key, 'user-b');

        // tslint:disable-next-line:prefer-for-of
        for (let k = 0; k < segments.length; k++) {
          const segment = segments[k];
          await createFeatureFlagSegment(binding as any, project.key, env.key, flag.key, segment.key);
        }
      }
      console.log('LOOP COMPLETE');
    }

    console.log('QUERYING PROJECT');
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
  } catch (err) {
    console.log('ERROR MOFO');
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
