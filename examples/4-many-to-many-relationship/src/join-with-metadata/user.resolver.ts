import { GraphQLResolveInfo } from 'graphql';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseResolver, Context } from '../../../../src';
import { UserCreateInput, UserWhereArgs, UserWhereInput } from '../../generated';
import { UserRole } from './user-role.entity';
import { User } from './user.entity';

@Resolver(User)
export class UserResolver extends BaseResolver<User> {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
    super(User, userRepository);
  }

  @FieldResolver(returns => [UserRole])
  userRoles(@Root() user: User, @Ctx() ctx: Context): Promise<UserRole[]> {
    console.log('user: ', user);

    return ctx.dataLoader.loaders.User.userRoles.load(user);
  }

  @Query(returns => [User])
  async users(
    @Args() { where, orderBy, limit, offset }: UserWhereArgs,
    @Ctx() ctx: Context,
    info: GraphQLResolveInfo
  ): Promise<User[]> {
    return this.find<UserWhereInput>(where, orderBy, limit, offset);
  }

  @Mutation(returns => User)
  async createUser(@Arg('data') data: UserCreateInput, @Ctx() ctx: Context): Promise<User> {
    return this.create(data, ctx.user.id);
  }
}
