import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseContext, BaseResolver } from '@warthog/core';
import {
  UserRoleCreateInput,
  UserRoleCreateManyArgs,
  UserRoleWhereArgs,
  UserRoleWhereInput
} from '../../generated';
import { Role } from './role.model';
import { UserRole } from './user-role.model';
import { User } from './user.model';

@Resolver(UserRole)
export class UserRoleResolver extends BaseResolver<UserRole> {
  constructor(
    @InjectRepository(UserRole) public readonly userRoleRepository: Repository<UserRole>
  ) {
    super(UserRole, userRoleRepository);
  }

  @FieldResolver(() => User)
  user(@Root() userRole: UserRole, @Ctx() ctx: BaseContext): Promise<User> {
    return ctx.dataLoader.loaders.UserRole.user.load(userRole);
  }

  @FieldResolver(() => Role)
  role(@Root() userRole: UserRole, @Ctx() ctx: BaseContext): Promise<Role> {
    return ctx.dataLoader.loaders.UserRole.role.load(userRole);
  }

  @Query(() => [UserRole])
  async userRoles(@Args() { where, orderBy, limit, offset }: UserRoleWhereArgs): Promise<
    UserRole[]
  > {
    return this.find<UserRoleWhereInput>(where, orderBy, limit, offset);
  }

  @Mutation(() => UserRole)
  async createUserRole(
    @Arg('data') data: UserRoleCreateInput,
    @Ctx() ctx: BaseContext
  ): Promise<UserRole> {
    return this.create(data, ctx.user.id);
  }

  @Mutation(() => [UserRole])
  async createManyUserRoles(
    @Args() { data }: UserRoleCreateManyArgs,
    @Ctx() ctx: BaseContext
  ): Promise<UserRole[]> {
    return this.createMany(data, ctx.user.id);
  }
}
