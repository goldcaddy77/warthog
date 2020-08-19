import { BaseService } from '@warthog/core';
import { Service } from 'typedi';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { User } from './user.model';

@Service('UserService')
export class UserService extends BaseService<User> {
  constructor(@InjectRepository(User) protected readonly repository: Repository<User>) {
    super(User, repository);
  }

  async create(data: DeepPartial<User>, userId: string): Promise<User> {
    const newUser = await super.create(data, userId);

    // Perform some side effects

    return newUser;
  }
}
