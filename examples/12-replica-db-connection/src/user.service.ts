import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseService } from '../../../src';

import { User } from './user.model';

@Service('UserService')
export class UserService extends BaseService<User> {
  constructor(@InjectRepository(User) protected readonly repository: Repository<User>) {
    super(User, repository);
  }

  // This query will use the "master" server, even though it would typically use "slave" by default for doing a find
  async findFromMaster(): Promise<User[]> {
    return super.find(undefined, undefined, undefined, undefined, undefined, {
      replicationMode: 'master'
    });
  }
}
