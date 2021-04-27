import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';

import { BaseContext } from '../../../../src';
import { UserCreateInput, UserWhereArgs } from '../../generated';
import { UserRole } from './user-role.model';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(User)
export class UserResolver {
  constructor(@Inject('UserService') public readonly service: UserService) {}

  @FieldResolver(() => [UserRole])
  userRoles(@Root() user: User, @Ctx() ctx: BaseContext): Promise<UserRole[]> {
    return ctx.dataLoader.loaders.User.userRoles.load(user);
  }

  @Query(() => [User])
  async users(@Args() { where, orderBy, limit, offset }: UserWhereArgs): Promise<User[]> {
    return this.service.find(where, orderBy, limit, offset);
  }

  @Mutation(() => User)
  async createUser(@Arg('data') data: UserCreateInput, @Ctx() ctx: BaseContext): Promise<User> {
    return this.service.create(data, ctx.user.id);
  }
}
