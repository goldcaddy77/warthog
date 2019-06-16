import { Inject, Service } from 'typedi';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseService } from '../../../../src';

import { ProjectService } from '../project/project.service';
import { Environment } from './environment.model';

@Service('EnvironmentService')
export class EnvironmentService extends BaseService<Environment> {
  constructor(
    @InjectRepository(Environment)
    protected readonly repository: Repository<Environment>,
    @Inject('ProjectService') readonly projectService: ProjectService
  ) {
    super(Environment, repository);
  }

  // Linking of Environment to Project happens via `projKey`
  async create(data: DeepPartial<Environment>, userId: string): Promise<Environment> {
    const project = await this.projectService.findOne({ key: data.projKey });
    const payload = { ...data, projKey: project.key, projectId: project.id };

    return super.create(payload, userId);
  }
}
