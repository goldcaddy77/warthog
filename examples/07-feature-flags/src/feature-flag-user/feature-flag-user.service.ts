import { Inject, Service } from 'typedi';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseService } from '../../../../src';

import { EnvironmentService } from '../environment/environment.service';
import { FeatureFlagService } from '../feature-flag/feature-flag.service';
import { ProjectService } from '../project/project.service';
import { UserService } from '../user/user.service';

import { FeatureFlagUser } from './feature-flag-user.model';

@Service('FeatureFlagUserService')
export class FeatureFlagUserService extends BaseService<FeatureFlagUser> {
  constructor(
    @InjectRepository(FeatureFlagUser)
    protected readonly repository: Repository<FeatureFlagUser>,
    @Inject('EnvironmentService') readonly environmentService: EnvironmentService,
    @Inject('FeatureFlagService') readonly featureFlagService: FeatureFlagService,
    @Inject('ProjectService') readonly projectService: ProjectService,
    @Inject('UserService') readonly userService: UserService
  ) {
    super(FeatureFlagUser, repository);
  }

  // Linking of Environment to Project happens via `projKey`
  async create(data: FeatureFlagUser, userId: string): Promise<FeatureFlagUser> {
    const project = await this.projectService.findOne({ key: data.projKey });
    const environment = await this.environmentService.findOne({
      key: data.envKey,
      projKey: data.projKey
    });
    const featureFlag = await this.featureFlagService.findOne({
      key: data.featureKey,
      projKey: data.projKey
    });
    const user = await this.userService.findOrCreate(
      {
        key: data.userKey
      },
      userId
    );

    const payload = {
      envKey: data.envKey,
      environmentId: environment.id,
      featureFlagId: featureFlag.id,
      featureKey: data.featureKey,
      projKey: data.projKey,
      projectId: project.id,
      userId: user.id,
      userKey: data.userKey
    };

    return super.create(payload, userId);
  }
}
