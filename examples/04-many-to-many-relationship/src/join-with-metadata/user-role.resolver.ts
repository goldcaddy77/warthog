import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';

import { BaseContext } from '../../../../src';
import { UserRoleCreateInput, UserRoleCreateManyArgs, UserRoleWhereArgs } from '../../generated';
import { Role } from './role.model';
import { UserRole } from './user-role.model';
import { UserRoleService } from './user-role.service';
import { User } from './user.model';

@Resolver(UserRole)
export class UserRoleResolver {
  constructor(@Inject('UserRoleService') public readonly service: UserRoleService) {}

  @FieldResolver(() => User)
  user(@Root() userRole: UserRole, @Ctx() ctx: BaseContext): Promise<User> {
    return ctx.dataLoader.loaders.UserRole.user.load(userRole);
  }

  @FieldResolver(() => Role)
  role(@Root() userRole: UserRole, @Ctx() ctx: BaseContext): Promise<Role> {
    return ctx.dataLoader.loaders.UserRole.role.load(userRole);
  }

  @Query(() => [UserRole])
  async userRoles(
    @Args() { where, orderBy, limit, offset }: UserRoleWhereArgs
  ): Promise<UserRole[]> {
    return this.service.find(where, orderBy, limit, offset);
  }

  @Mutation(() => UserRole)
  async createUserRole(
    @Arg('data') data: UserRoleCreateInput,
    @Ctx() ctx: BaseContext
  ): Promise<UserRole> {
    return this.service.create(data, ctx.user.id);
  }

  @Mutation(() => [UserRole])
  async createManyUserRoles(
    @Args() { data }: UserRoleCreateManyArgs,
    @Ctx() ctx: BaseContext
  ): Promise<UserRole[]> {
    return this.service.createMany(data, ctx.user.id);
  }
}
