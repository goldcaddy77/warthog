import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';

import { Fields, StandardDeleteResponse, UserId } from '@warthog/core';
import { BaseContext } from '@warthog/server-express';

import {
  PostCreateInput,
  PostCreateManyArgs,
  PostUpdateArgs,
  PostWhereArgs,
  PostWhereInput,
  PostWhereUniqueInput
} from '../../../generated';

import { User } from '../user/user.model';

import { Post } from './post.model';
import { PostService } from './post.service';

@Resolver(Post)
export class PostResolver {
  constructor(@Inject('PostService') public readonly service: PostService) {}

  @FieldResolver(() => User)
  user(@Root() post: Post, @Ctx() ctx: BaseContext): Promise<User> {
    return ctx.dataLoader.loaders.Post.user.load(post);
  }

  @Query(() => [Post])
  async posts(
    @Args() { where, orderBy, limit, offset }: PostWhereArgs,
    @Fields() fields: string[]
  ): Promise<Post[]> {
    return this.service.find<PostWhereInput>(where, orderBy, limit, offset, fields);
  }

  @Query(() => Post)
  async post(@Arg('where') where: PostWhereUniqueInput): Promise<Post> {
    return this.service.findOne<PostWhereUniqueInput>(where);
  }

  @Mutation(() => Post)
  async createPost(@Arg('data') data: PostCreateInput, @UserId() userId: string): Promise<Post> {
    return this.service.create(data, userId);
  }

  @Mutation(() => Post)
  async updatePost(
    @Args() { data, where }: PostUpdateArgs,
    @UserId() userId: string
  ): Promise<Post> {
    return this.service.update(data, where, userId);
  }

  @Mutation(() => [Post])
  async createManyPosts(
    @Args() { data }: PostCreateManyArgs,
    @UserId() userId: string
  ): Promise<Post[]> {
    return this.service.createMany(data, userId);
  }

  @Mutation(() => StandardDeleteResponse)
  async deletePost(
    @Arg('where') where: PostWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}
