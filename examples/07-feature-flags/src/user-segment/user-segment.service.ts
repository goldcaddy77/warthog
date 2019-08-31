import { Inject, Service } from 'typedi';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseService } from '../../../../src';

import { EnvironmentService } from '../environment/environment.service';
import { ProjectService } from '../project/project.service';
import { SegmentService } from '../segment/segment.service';
import { UserService } from '../user/user.service';

import { UserSegment } from './user-segment.model';

@Service('UserSegmentService')
export class UserSegmentService extends BaseService<UserSegment> {
  constructor(
    @InjectRepository(UserSegment) protected readonly repository: Repository<UserSegment>,
    @Inject('EnvironmentService') readonly environmentService: EnvironmentService,
    @Inject('SegmentService') readonly segmentService: SegmentService,
    @Inject('ProjectService') readonly projectService: ProjectService,
    @Inject('UserService') readonly userService: UserService
  ) {
    super(UserSegment, repository);
  }

  // Linking of Environment to Project happens via `projKey`
  async create(data: DeepPartial<UserSegment>, userId: string): Promise<UserSegment> {
    const project = await this.projectService.findOne({ key: data.projKey });
    const environment = await this.environmentService.findOne({
      key: data.envKey,
      projKey: data.projKey
    });
    const segment = await this.segmentService.findOne({
      envKey: data.envKey,
      key: data.segmentKey,
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
      projKey: data.projKey,
      projectId: project.id,
      segmentId: segment.id,
      segmentKey: data.segmentKey,
      userId: user.id,
      userKey: data.userKey
    };

    return super.create(payload, userId);
  }
}
