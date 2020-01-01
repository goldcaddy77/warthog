import { Inject, Service } from 'typedi';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseService } from '@warthog/core';

import { EnvironmentService } from '../environment/environment.service';
import { ProjectService } from '../project/project.service';

import { Segment } from './segment.model';

@Service('SegmentService')
export class SegmentService extends BaseService<Segment> {
  constructor(
    @InjectRepository(Segment) protected readonly repository: Repository<Segment>,
    @Inject('EnvironmentService') readonly environmentService: EnvironmentService,
    @Inject('ProjectService') readonly projectService: ProjectService
  ) {
    super(Segment, repository);
  }

  // Linking of Environment to Project happens via `projKey`
  async create(data: DeepPartial<Segment>, userId: string): Promise<Segment> {
    const environment = await this.environmentService.findOne({
      key: data.envKey,
      projKey: data.projKey
    });
    const project = await this.projectService.findOne({ key: data.projKey });
    const payload = {
      ...data,
      envKey: environment.key,
      environmentId: environment.id,
      projKey: project.key,
      projectId: project.id
    };

    return super.create(payload, userId);
  }
}
