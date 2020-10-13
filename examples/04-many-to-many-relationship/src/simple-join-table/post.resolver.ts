import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from '@nestjs/graphql';
import { Repository } from 'typeorm';
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

  @FieldResolver(() => [Post])
  posts(@Root() author: Author, @Ctx() ctx: BaseContext): Promise<Post[]> {
    return ctx.dataLoader.loaders.Author.posts.load(author);
  }

  @Query(() => [Post])
  async roles(@Args() { where, orderBy, limit, offset }: PostWhereArgs): Promise<Post[]> {
    return this.find<PostWhereInput>(where, orderBy, limit, offset);
  }

  @Mutation(() => Post)
  async createPost(@Arg('data') data: PostCreateInput, @Ctx() ctx: BaseContext): Promise<Post> {
    return this.create(data, ctx.user.id);
  }
}
