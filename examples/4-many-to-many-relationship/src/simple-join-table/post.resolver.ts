import { GraphQLResolveInfo } from 'graphql';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseResolver, Context } from '../../../../src';
import { PostCreateInput, PostWhereArgs, PostWhereInput } from '../../generated';

import { Author } from './author.entity';
import { Post } from './post.entity';

@Resolver(Post)
export class PostResolver extends BaseResolver<Post> {
  constructor(@InjectRepository(Post) private readonly postRepository: Repository<Post>) {
    super(Post, postRepository);
  }

  @FieldResolver(returns => [Post])
  posts(@Root() author: Author, @Ctx() ctx: Context): Promise<Post[]> {
    console.log('author: ', author);

    return ctx.dataLoader.loaders.Author.posts.load(author);
  }

  @Query(returns => [Post])
  async roles(
    @Args() { where, orderBy, limit, offset }: PostWhereArgs,
    @Ctx() ctx: Context,
    info: GraphQLResolveInfo
  ): Promise<Post[]> {
    return this.find<PostWhereInput>(where, orderBy, limit, offset);
  }

  @Mutation(returns => Post)
  async createPost(@Arg('data') data: PostCreateInput, @Ctx() ctx: Context): Promise<Post> {
    return this.create(data, ctx.user.id);
  }
}
