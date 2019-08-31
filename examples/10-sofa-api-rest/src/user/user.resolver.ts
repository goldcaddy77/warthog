import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';

import { StandardDeleteResponse, UserId } from '../../../../src';
import {
  UserCreateInput,
  UserUpdateArgs,
  UserWhereArgs,
  UserWhereInput,
  UserWhereUniqueInput
} from '../../generated';

import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(User)
export class UserResolver {
  constructor(@Inject('UserService') public readonly service: UserService) {}

  @Query(() => [User])
  async users(@Args() { where, orderBy, limit, offset }: UserWhereArgs): Promise<User[]> {
    return this.service.find<UserWhereInput>(where, orderBy, limit, offset);
  }

  @Query(() => User)
  async user(@Arg('where') where: UserWhereUniqueInput): Promise<User> {
    return this.service.findOne<UserWhereUniqueInput>(where);
  }

  @Mutation(() => User)
  async createUser(@Arg('data') data: UserCreateInput, @UserId() userId: string): Promise<User> {
    return this.service.create(data, userId);
  }

  @Mutation(() => User)
  async updateUser(
    @Args() { data, where }: UserUpdateArgs,
    @UserId() userId: string
  ): Promise<User> {
    return this.service.update(data, where, userId);
  }

  @Mutation(() => StandardDeleteResponse)
  async deleteUser(
    @Arg('where') where: UserWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}
