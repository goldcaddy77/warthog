import { Inject, Service } from 'typedi';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseService } from '@warthog/core';

import { ProjectService } from '../project/project.service';

import { FeatureFlag } from './feature-flag.model';
import { FeatureFlagsForUserInput } from './feature-flag.resolver';

@Service('FeatureFlagService')
export class FeatureFlagService extends BaseService<FeatureFlag> {
  constructor(
    @InjectRepository(FeatureFlag) protected readonly repository: Repository<FeatureFlag>,
    @Inject('ProjectService') readonly projectService: ProjectService
  ) {
    super(FeatureFlag, repository);
  }

  async create(data: DeepPartial<FeatureFlag>, userId: string): Promise<FeatureFlag> {
    const project = await this.projectService.findOne({ key: data.projKey });
    const payload = { ...data, projKey: project.key, projectId: project.id };

    return super.create(payload, userId);
  }

  async flagsForUser(data: FeatureFlagsForUserInput): Promise<string[]> {
    const query = `
      SELECT ffu.feature_key
      FROM feature_flag_users ffu
      WHERE ffu.user_key = $1
        AND ffu.proj_key = $2
        AND ffu.env_key = $3
      UNION
      SELECT ffs.feature_key
      FROM user_segments us
      INNER JOIN segments s ON us.segment_id = s.id
      INNER JOIN feature_flag_segments ffs ON ffs.segment_id = s.id
      WHERE us.user_key = $1
        AND us.proj_key = $2
        AND us.env_key = $3;
    `;

    const results = await this.repository.query(query, [data.userKey, data.projKey, data.envKey]);

    return results.map(item => item.feature_key);
  }
}
