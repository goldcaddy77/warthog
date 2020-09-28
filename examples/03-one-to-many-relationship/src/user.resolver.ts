import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseContext, BaseResolver, StandardDeleteResponse } from 'warthog';
import {
  UserCreateInput,
  UserUpdateArgs,
  UserWhereArgs,
  UserWhereInput,
  UserWhereUniqueInput
} from '../generated';

import { Post } from './post.model';
import { User } from './user.model';

// Note: we have to specify `User` here instead of (() => User) because for some reason this
// changes the object reference when it's trying to add the FieldResolver and things break
@Resolver(User)
export class UserResolver extends BaseResolver<User> {
  constructor(@InjectRepository(User) public readonly userRepository: Repository<User>) {
    super(User, userRepository);
  }

  @FieldResolver()
  posts(@Root() user: User, @Ctx() ctx: BaseContext): Promise<Post[]> {
    return ctx.dataLoader.loaders.User.posts.load(user);
  }

  @Query(() => [User])
  async users(@Args() { where, orderBy, limit, offset }: UserWhereArgs): Promise<User[]> {
    return this.find<UserWhereInput>(where, orderBy, limit, offset);
  }

  @Query(() => User)
  async user(@Arg('where') where: UserWhereUniqueInput): Promise<User> {
    return this.findOne<UserWhereUniqueInput>(where);
  }

  @Mutation(() => User)
  async createUser(@Arg('data') data: UserCreateInput, @Ctx() ctx: BaseContext): Promise<User> {
    return this.create(data, ctx.user.id);
  }

  @Mutation(() => User)
  async updateUser(
    @Args() { data, where }: UserUpdateArgs,
    @Ctx() ctx: BaseContext
  ): Promise<User> {
    return this.update(data, where, ctx.user.id);
  }

  @Mutation(() => StandardDeleteResponse)
  async deleteUser(
    @Arg('where') where: UserWhereUniqueInput,
    @Ctx() ctx: BaseContext
  ): Promise<StandardDeleteResponse> {
    return this.delete(where, ctx.user.id);
  }
}
