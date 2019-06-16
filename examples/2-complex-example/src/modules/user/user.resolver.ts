import { GraphQLResolveInfo } from 'graphql';
import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseContext, BaseResolver, StandardDeleteResponse } from '../../../../../src';
import {
  UserCreateInput,
  UserUpdateArgs,
  UserWhereArgs,
  UserWhereInput,
  UserWhereUniqueInput
} from '../../../generated';

import { User } from './user.model';

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

  @Authorized('user:read')
  @Query(returns => User)
  async user(@Arg('where') where: UserWhereUniqueInput): Promise<User> {
    return this.findOne<UserWhereUniqueInput>(where);
  }

  @Authorized('user:create')
  @Mutation(returns => User)
  async createUser(@Arg('data') data: UserCreateInput, @Ctx() ctx: BaseContext): Promise<User> {
    return this.create(data, ctx.user.id);
  }

  @Authorized('user:update')
  @Mutation(returns => User)
  async updateUser(
    @Args() { data, where }: UserUpdateArgs,
    @Ctx() ctx: BaseContext
  ): Promise<User> {
    return this.update(data, where, ctx.user.id);
  }

  @Authorized('user:delete')
  @Mutation(returns => StandardDeleteResponse)
  async deleteUser(
    @Arg('where') where: UserWhereUniqueInput,
    @Ctx() ctx: BaseContext
  ): Promise<StandardDeleteResponse> {
    return this.delete(where, ctx.user.id);
  }
}
