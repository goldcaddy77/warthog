import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseService } from '../../../../src';

import { Environment } from './environment.model';

@Service('EnvironmentService')
export class EnvironmentService extends BaseService<Environment> {
  constructor(
    @InjectRepository(Environment)
    protected readonly repository: Repository<Environment>
  ) {
    super(Environment, repository);
  }
}
