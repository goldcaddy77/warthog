import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';

import { BaseContext, StandardDeleteResponse } from '../../../src';
import { PostCreateInput, PostUpdateArgs, PostWhereArgs, PostWhereUniqueInput } from '../generated';

import { Post } from './post.model';
import { User } from './user.model';
import { PostService } from './post.service';

@Resolver(Post)
export class PostResolver {
  constructor(@Inject('PostService') public readonly service: PostService) {}

  @FieldResolver(() => User)
  user(@Root() post: Post, @Ctx() ctx: BaseContext): Promise<User> {
    return ctx.dataLoader.loaders.Post.user.load(post);
  }

  @Query(() => [Post])
  async posts(@Args() { where, orderBy, limit, offset }: PostWhereArgs): Promise<Post[]> {
    return this.service.find(where, orderBy, limit, offset);
  }

  @Query(() => Post)
  async post(@Arg('where') where: PostWhereUniqueInput): Promise<Post> {
    return this.service.findOne<PostWhereUniqueInput>(where);
  }

  @Mutation(() => Post)
  async createPost(@Arg('data') data: PostCreateInput, @Ctx() ctx: BaseContext): Promise<Post> {
    return this.service.create(data, ctx.user.id);
  }

  @Mutation(() => Post)
  async updatePost(
    @Args() { data, where }: PostUpdateArgs,
    @Ctx() ctx: BaseContext
  ): Promise<Post> {
    return this.service.update(data, where, ctx.user.id);
  }

  @Mutation(() => StandardDeleteResponse)
  async deletePost(
    @Arg('where') where: PostWhereUniqueInput,
    @Ctx() ctx: BaseContext
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, ctx.user.id);
  }
}
