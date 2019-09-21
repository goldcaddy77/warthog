import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseService } from '../../../src';

import { User } from './user.model';
import { Service } from 'typedi';

@Service('UserService')
export class UserService extends BaseService<User> {
  constructor(@InjectRepository(User) public readonly userRepository: Repository<User>) {
    super(User, userRepository);
  }

  async userById(id: string): Promise<User> {
    return this.findOne({ id });
  }
}
