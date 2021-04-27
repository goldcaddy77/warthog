import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';

import { BaseContext } from '../../../../src';
import { PostCreateInput, PostWhereArgs } from '../../generated';

import { Author } from './author.model';
import { Post } from './post.model';
import { PostService } from './post.service';

@Resolver(Post)
export class PostResolver {
  constructor(@Inject('PostService') public readonly service: PostService) {}

  @FieldResolver(() => [Post])
  posts(@Root() author: Author, @Ctx() ctx: BaseContext): Promise<Post[]> {
    return ctx.dataLoader.loaders.Author.posts.load(author);
  }

  @Query(() => [Post])
  async roles(@Args() { where, orderBy, limit, offset }: PostWhereArgs): Promise<Post[]> {
    return this.service.find(where, orderBy, limit, offset);
  }

  @Mutation(() => Post)
  async createPost(@Arg('data') data: PostCreateInput, @Ctx() ctx: BaseContext): Promise<Post> {
    return this.service.create(data, ctx.user.id);
  }
}
