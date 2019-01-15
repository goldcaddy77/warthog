import { GraphQLResolveInfo } from 'graphql';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseResolver, Context } from '../../../../src';
import { AuthorCreateInput, AuthorWhereArgs, AuthorWhereInput } from '../../generated';
import { Author } from './author.entity';
import { Post } from './post.entity';

@Resolver(Author)
export class AuthorResolver extends BaseResolver<Author> {
  constructor(@InjectRepository(Author) private readonly authorRepository: Repository<Author>) {
    super(Author, authorRepository);
  }

  @FieldResolver(returns => [Post])
  posts(@Root() author: Author, @Ctx() ctx: Context): Promise<Post[]> {
    console.log('author: ', author);

    return ctx.dataLoader.loaders.Author.posts.load(author);
  }

  @Query(returns => [Author])
  async authors(
    @Args() { where, orderBy, limit, offset }: AuthorWhereArgs,
    @Ctx() ctx: Context,
    info: GraphQLResolveInfo
  ): Promise<Author[]> {
    return this.find<AuthorWhereInput>(where, orderBy, limit, offset);
  }

  @Mutation(returns => Author)
  async createAuthor(@Arg('data') data: AuthorCreateInput, @Ctx() ctx: Context): Promise<Author> {
    return this.create(data, ctx.user.id);
  }
}
