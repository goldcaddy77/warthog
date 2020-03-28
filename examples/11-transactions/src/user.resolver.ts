import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';

import { BaseContext } from '../../../src';

import { UserCreateInput, UserWhereArgs, UserWhereInput } from '../generated';

import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(User)
export class UserResolver {
  constructor(@Inject('UserService') readonly service: UserService) {}

  @Query(() => [User])
  async users(@Args() { where, orderBy, limit, offset }: UserWhereArgs): Promise<User[]> {
    return this.service.find<UserWhereInput>(where, orderBy, limit, offset);
  }

  // If this was User instead of [User] you get "Cannot return null for non-nullable field User.id"
  @Mutation(() => [User])
  async successfulTransaction(
    @Arg('data') data: UserCreateInput,
    @Ctx() ctx: BaseContext
  ): Promise<User[]> {
    return this.service.successfulTransaction(data, ctx.user.id);
  }

  @Mutation(() => [User])
  async failedTransaction(
    @Arg('data') data: UserCreateInput,
    @Ctx() ctx: BaseContext
  ): Promise<User[]> {
    return this.service.failedTransaction(data, ctx.user.id);
  }
}
