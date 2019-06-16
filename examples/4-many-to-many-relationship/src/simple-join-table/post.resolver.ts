import { GraphQLResolveInfo } from 'graphql';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseContext, BaseResolver } from '../../../../src';
import { PostCreateInput, PostWhereArgs, PostWhereInput } from '../../generated';

import { Author } from './author.model';
import { Post } from './post.model';

@Resolver(Post)
export class PostResolver extends BaseResolver<Post> {
  constructor(@InjectRepository(Post) public readonly postRepository: Repository<Post>) {
    super(Post, postRepository);
  }

  @FieldResolver(returns => [Post])
  posts(@Root() author: Author, @Ctx() ctx: BaseContext): Promise<Post[]> {
    return ctx.dataLoader.loaders.Author.posts.load(author);
  }

  @Query(returns => [Post])
  async roles(
    @Args() { where, orderBy, limit, offset }: PostWhereArgs,
    @Ctx() ctx: BaseContext,
    info: GraphQLResolveInfo
  ): Promise<Post[]> {
    return this.find<PostWhereInput>(where, orderBy, limit, offset);
  }

  @Mutation(returns => Post)
  async createPost(@Arg('data') data: PostCreateInput, @Ctx() ctx: BaseContext): Promise<Post> {
    return this.create(data, ctx.user.id);
  }
}
