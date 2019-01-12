import { GraphQLResolveInfo } from 'graphql';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseResolver, Context, StandardDeleteResponse } from '../../../src';
import { PostCreateInput, PostUpdateArgs, PostWhereArgs, PostWhereInput, PostWhereUniqueInput } from '../generated';

import { Post } from './post.entity';
import { User } from './user.entity';

// Note: we have to specify `Post` here instead of (of => Post) because for some reason this
// changes the object reference when it's trying to add the FieldResolver and things break
@Resolver(Post)
export class PostResolver extends BaseResolver<Post> {
  constructor(@InjectRepository(Post) private readonly postRepository: Repository<Post>) {
    super(Post, postRepository);
  }

  @FieldResolver(returns => User)
  user(@Root() post: Post, @Ctx() ctx: Context): Promise<User> {
    return ctx.dataLoader.loaders.Post.user.load(post);
  }

  @Query(returns => [Post])
  async posts(
    @Args() { where, orderBy, limit, offset }: PostWhereArgs,
    @Ctx() ctx: Context,
    info: GraphQLResolveInfo
  ): Promise<Post[]> {
    return this.find<PostWhereInput>(where, orderBy, limit, offset);
  }

  @Query(returns => Post)
  async post(@Arg('where') where: PostWhereUniqueInput): Promise<Post> {
    return this.findOne<PostWhereUniqueInput>(where);
  }

  @Mutation(returns => Post)
  async createPost(@Arg('data') data: PostCreateInput, @Ctx() ctx: Context): Promise<Post> {
    return this.create(data, ctx.user.id);
  }

  @Mutation(returns => Post)
  async updatePost(@Args() { data, where }: PostUpdateArgs, @Ctx() ctx: Context): Promise<Post> {
    return this.update(data, where, ctx.user.id);
  }

  @Mutation(returns => StandardDeleteResponse)
  async deletePost(@Arg('where') where: PostWhereUniqueInput, @Ctx() ctx: Context): Promise<StandardDeleteResponse> {
    return this.delete(where, ctx.user.id);
  }
}
