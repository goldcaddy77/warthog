import { GraphQLResolveInfo } from 'graphql';
import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseContext, BaseResolver, StandardDeleteResponse } from '../../../src';
import {
  UserCreateInput,
  UserUpdateArgs,
  UserWhereArgs,
  UserWhereInput,
  UserWhereUniqueInput
} from '../generated/classes';

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

  @Query(returns => User)
  async user(@Arg('where') where: UserWhereUniqueInput): Promise<User> {
    return this.findOne<UserWhereUniqueInput>(where);
  }

  @Mutation(returns => User)
  async createUser(@Arg('data') data: UserCreateInput, @Ctx() ctx: BaseContext): Promise<User> {
    return this.create(data, 'fakeid1');
  }

  @Mutation(returns => User)
  async updateUser(
    @Args() { data, where }: UserUpdateArgs,
    @Ctx() ctx: BaseContext
  ): Promise<User> {
    return this.update(data, where, 'fakeid1');
  }

  @Mutation(returns => StandardDeleteResponse)
  async deleteUser(
    @Arg('where') where: UserWhereUniqueInput,
    @Ctx() ctx: BaseContext
  ): Promise<StandardDeleteResponse> {
    return this.delete(where, 'fakeid1');
  }
}
