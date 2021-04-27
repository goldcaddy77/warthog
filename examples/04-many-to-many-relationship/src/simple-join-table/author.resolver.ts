import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';

import { BaseContext } from '../../../../src';
import { AuthorCreateInput, AuthorWhereArgs } from '../../generated';
import { Author } from './author.model';
import { AuthorService } from './author.service';
import { Post } from './post.model';

@Resolver(Author)
export class AuthorResolver {
  constructor(@Inject('AuthorService') public readonly service: AuthorService) {}

  @FieldResolver(() => [Post])
  posts(@Root() author: Author, @Ctx() ctx: BaseContext): Promise<Post[]> {
    return ctx.dataLoader.loaders.Author.posts.load(author);
  }

  @Query(() => [Author])
  async authors(@Args() { where, orderBy, limit, offset }: AuthorWhereArgs): Promise<Author[]> {
    return this.service.find(where, orderBy, limit, offset);
  }

  @Mutation(() => Author)
  async createAuthor(
    @Arg('data') data: AuthorCreateInput,
    @Ctx() ctx: BaseContext
  ): Promise<Author> {
    return this.service.create(data, ctx.user.id);
  }
}
