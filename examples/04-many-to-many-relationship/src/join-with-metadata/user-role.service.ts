import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseService } from '../../../../src';

import { UserRole } from './user-role.model';

@Service('UserRoleService')
export class UserRoleService extends BaseService<UserRole> {
  constructor(@InjectRepository(UserRole) protected readonly repository: Repository<UserRole>) {
    super(UserRole, repository);
  }
}
