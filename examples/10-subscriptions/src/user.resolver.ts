// See also: https://github.com/MichalLytek/@nestjs/graphql/tree/master/examples/simple-subscriptions

import { PubSubEngine } from 'graphql-subscriptions';
import {
  Arg,
  Args,
  Ctx,
  Mutation,
  PubSub,
  Query,
  Resolver,
  Root,
  Subscription
} from '@nestjs/graphql';
import { Inject } from 'typedi';

import { BaseContext, StandardDeleteResponse } from '../../../src';
import { UserCreateInput, UserUpdateArgs, UserWhereArgs, UserWhereUniqueInput } from '../generated';

import { User } from './user.model';
import { UserService } from './user.service';

// ObjectType();
// class AllUserSubscriptionResponse {
//   @Field()
//   action: string; // type Action = 'create' | 'update' | 'delete';

//   @Field(() => User)
//   user: User;
// }

@Resolver(User)
export class UserResolver {
  constructor(@Inject('UserService') readonly service: UserService) {}

  @Query(() => [User])
  async users(@Args() { where, orderBy, limit, offset }: UserWhereArgs): Promise<User[]> {
    return this.service.find(where, orderBy, limit, offset);
  }

  @Query(() => User)
  async user(@Arg('where') where: UserWhereUniqueInput): Promise<User> {
    return this.service.findOne<UserWhereUniqueInput>(where);
  }

  @Mutation(() => User)
  async createUser(
    @Arg('data') data: UserCreateInput,
    @Ctx() ctx: BaseContext,
    @PubSub() pubSub: PubSubEngine
  ): Promise<User> {
    const response = this.service.create(data, ctx.user.id);
    await pubSub.publish('user:create', response);
    return response;
  }

  @Mutation(() => User)
  async updateUser(
    @Args() { data, where }: UserUpdateArgs,
    @Ctx() ctx: BaseContext,
    @PubSub() pubSub: PubSubEngine
  ): Promise<User> {
    const response = this.service.update(data, where, ctx.user.id);
    await pubSub.publish('user:update', response);
    return response;
  }

  @Mutation(() => StandardDeleteResponse)
  async deleteUser(
    @Arg('where') where: UserWhereUniqueInput,
    @Ctx() ctx: BaseContext,
    @PubSub() pubSub: PubSubEngine
  ): Promise<StandardDeleteResponse> {
    const response = this.service.delete(where, ctx.user.id);
    await pubSub.publish('user:delete', response);
    return response;
  }

  @Subscription({ topics: 'user:create' })
  createUserSubscription(@Root() user: User): User {
    return user;
  }

  // Note: not working yet
  // @Subscription({ topics: ['user:create', 'user:update', 'user:delete'] })
  // allUserSubscription(@Root()
  // {
  //   action,
  //   user
  // }: AllUserSubscriptionResponse): AllUserSubscriptionResponse {
  //   return {
  //     action,
  //     user
  //   };
  // }
}
