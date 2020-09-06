import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';

import { BaseContext, StandardDeleteResponse, UserId } from '../../../../../src';
import {
  UserCreateInput,
  UserUpdateArgs,
  UserWhereArgs,
  UserWhereUniqueInput
} from '../../../generated';

import { Post } from '../post/post.model';

import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(User)
export class UserResolver {
  constructor(@Inject('UserService') public readonly service: UserService) {}

  @FieldResolver()
  posts(@Root() user: User, @Ctx() ctx: BaseContext): Promise<Post[]> {
    return ctx.dataLoader.loaders.User.posts.load(user);
  }

  @Query(() => [User])
  async users(@Args() { where, orderBy, limit, offset }: UserWhereArgs): Promise<User[]> {
    return this.service.find(where, orderBy, limit, offset);
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
