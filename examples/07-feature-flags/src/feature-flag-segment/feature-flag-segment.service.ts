import { Inject, Service } from 'typedi';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseService } from 'warthog';

import { EnvironmentService } from '../environment/environment.service';
import { FeatureFlagService } from '../feature-flag/feature-flag.service';
import { ProjectService } from '../project/project.service';
import { SegmentService } from '../segment/segment.service';

import { FeatureFlagSegment } from './feature-flag-segment.model';

@Service('FeatureFlagSegmentService')
export class FeatureFlagSegmentService extends BaseService<FeatureFlagSegment> {
  constructor(
    @InjectRepository(FeatureFlagSegment)
    protected readonly repository: Repository<FeatureFlagSegment>,
    @Inject('EnvironmentService') readonly environmentService: EnvironmentService,
    @Inject('FeatureFlagService') readonly featureFlagService: FeatureFlagService,
    @Inject('ProjectService') readonly projectService: ProjectService,
    @Inject('SegmentService') readonly segmentService: SegmentService
  ) {
    super(FeatureFlagSegment, repository);
  }

  async create(data: DeepPartial<FeatureFlagSegment>, userId: string): Promise<FeatureFlagSegment> {
    const project = await this.projectService.findOne({ key: data.projKey });
    const environment = await this.environmentService.findOne({
      key: data.envKey,
      projKey: data.projKey
    });
    const featureFlag = await this.featureFlagService.findOne({
      key: data.featureKey,
      projKey: data.projKey
    });
    const segment = await this.segmentService.findOne({
      envKey: data.envKey,
      key: data.segmentKey,
      projKey: data.projKey
    });

    const payload = {
      envKey: data.envKey,
      environmentId: environment.id,
      featureFlagId: featureFlag.id,
      featureKey: data.featureKey,
      projKey: data.projKey,
      projectId: project.id,
      segmentId: segment.id,
      segmentKey: data.segmentKey
    };

    return super.create(payload, userId);
  }
}
