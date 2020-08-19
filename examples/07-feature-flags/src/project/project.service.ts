import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseService } from '@warthog/core';

import { Project } from './project.model';

@Service('ProjectService')
export class ProjectService extends BaseService<Project> {
  constructor(@InjectRepository(Project) protected readonly repository: Repository<Project>) {
    super(Project, repository);
  }
}
