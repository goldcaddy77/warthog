import { GraphQLResolveInfo } from 'graphql';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseContext, BaseResolver } from '../../../../src';
import { UserCreateInput, UserWhereArgs, UserWhereInput } from '../../generated';
import { UserRole } from './user-role.model';
import { User } from './user.model';

@Resolver(User)
export class UserResolver extends BaseResolver<User> {
  constructor(@InjectRepository(User) public readonly userRepository: Repository<User>) {
    super(User, userRepository);
  }

  @FieldResolver(returns => [UserRole])
  userRoles(@Root() user: User, @Ctx() ctx: BaseContext): Promise<UserRole[]> {
    return ctx.dataLoader.loaders.User.userRoles.load(user);
  }

  @Query(returns => [User])
  async users(
    @Args() { where, orderBy, limit, offset }: UserWhereArgs,
    @Ctx() ctx: BaseContext,
    info: GraphQLResolveInfo
  ): Promise<User[]> {
    return this.find<UserWhereInput>(where, orderBy, limit, offset);
  }

  @Mutation(returns => User)
  async createUser(@Arg('data') data: UserCreateInput, @Ctx() ctx: BaseContext): Promise<User> {
    return this.create(data, ctx.user.id);
  }
}
