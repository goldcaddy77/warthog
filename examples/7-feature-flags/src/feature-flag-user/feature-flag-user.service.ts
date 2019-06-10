import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseService } from '../../../../src';

import { FeatureFlagUser } from './feature-flag-user.model';

@Service('FeatureFlagUserService')
export class FeatureFlagUserService extends BaseService<FeatureFlagUser> {
  constructor(
    @InjectRepository(FeatureFlagUser)
    protected readonly repository: Repository<FeatureFlagUser>
  ) {
    super(FeatureFlagUser, repository);
  }

  async create(data: DeepPartial<FeatureFlagUser>, userId: string): Promise<FeatureFlagUser> {
    const newUser = await super.create(data, userId);

    // Create this user if they don't exist already
    // return this.userService.create(data, ctx.user.id);

    return newUser;
  }
}
