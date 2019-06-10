import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseService } from '../../../../src';

import { ProjectService } from '../project/project.service';
import { FeatureFlag } from './feature-flag.model';

@Service('FeatureFlagService')
export class FeatureFlagService extends BaseService<FeatureFlag> {
  constructor(
    @InjectRepository(FeatureFlag) protected readonly repository: Repository<FeatureFlag>,
    @Inject('ProjectService') readonly projectService: ProjectService
  ) {
    super(FeatureFlag, repository);
  }

  // Linking of Environment to Project happens via `projKey`
  async create(data: DeepPartial<FeatureFlag>, userId: string): Promise<FeatureFlag> {
    const project = await this.projectService.findOne({ key: data.projKey });
    const payload = { ...data, projKey: project.key, projectId: project.id };

    return super.create(payload, userId);
  }
}
