import { GraphQLResolveInfo } from 'graphql';
import { Args, Ctx, Query, Resolver } from 'type-graphql';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseContext, BaseResolver } from '../../../src';
import { UserWhereArgs, UserWhereInput } from '../generated';

import { User } from './user.model';

// Note: we have to specify `User` here instead of (of => User) because for some reason this
// changes the object reference when it's trying to add the FieldResolver and things break
@Resolver(User)
export class UserResolver extends BaseResolver<User> {
  constructor(@InjectRepository(User) public readonly userRepository: Repository<User>) {
    super(User, userRepository);
  }

  @Query(returns => [User])
  async users(
    @Args() { where, orderBy, limit, offset }: UserWhereArgs,
    @Ctx() ctx: BaseContext,
    info: GraphQLResolveInfo
  ): Promise<User[]> {
    return this.find<UserWhereInput>(where, orderBy, limit, offset);
  }
}
