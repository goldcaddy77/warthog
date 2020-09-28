import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseContext, BaseResolver, StandardDeleteResponse } from 'warthog';
import {
  PostCreateInput,
  PostUpdateArgs,
  PostWhereArgs,
  PostWhereInput,
  PostWhereUniqueInput
} from '../generated';

import { Post } from './post.model';
import { User } from './user.model';

// Note: we have to specify `Post` here instead of (() => Post) because for some reason this
// changes the object reference when it's trying to add the FieldResolver and things break
@Resolver(Post)
export class PostResolver extends BaseResolver<Post> {
  constructor(@InjectRepository(Post) public readonly postRepository: Repository<Post>) {
    super(Post, postRepository);
  }

  @FieldResolver(() => User)
  user(@Root() post: Post, @Ctx() ctx: BaseContext): Promise<User> {
    return ctx.dataLoader.loaders.Post.user.load(post);
  }

  @Query(() => [Post])
  async posts(@Args() { where, orderBy, limit, offset }: PostWhereArgs): Promise<Post[]> {
    return this.find<PostWhereInput>(where, orderBy, limit, offset);
  }

  @Query(() => Post)
  async post(@Arg('where') where: PostWhereUniqueInput): Promise<Post> {
    return this.findOne<PostWhereUniqueInput>(where);
  }

  @Mutation(() => Post)
  async createPost(@Arg('data') data: PostCreateInput, @Ctx() ctx: BaseContext): Promise<Post> {
    return this.create(data, ctx.user.id);
  }

  @Mutation(() => Post)
  async updatePost(
    @Args() { data, where }: PostUpdateArgs,
    @Ctx() ctx: BaseContext
  ): Promise<Post> {
    return this.update(data, where, ctx.user.id);
  }

  @Mutation(() => StandardDeleteResponse)
  async deletePost(
    @Arg('where') where: PostWhereUniqueInput,
    @Ctx() ctx: BaseContext
  ): Promise<StandardDeleteResponse> {
    return this.delete(where, ctx.user.id);
  }
}
