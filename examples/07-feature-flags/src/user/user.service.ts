import { Service } from 'typedi';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseService } from '@warthog/core';

import { User } from './user.model';

@Service('UserService')
export class UserService extends BaseService<User> {
  constructor(@InjectRepository(User) protected readonly repository: Repository<User>) {
    super(User, repository);
  }

  async findOrCreate(data: DeepPartial<User>, userId: string): Promise<User> {
    const users = await this.find(data);
    if (users && users.length > 0) {
      return users[0];
    }

    return this.create(data, userId);
  }
}
