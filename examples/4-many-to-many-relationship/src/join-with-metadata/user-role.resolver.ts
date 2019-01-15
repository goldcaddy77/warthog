import { GraphQLResolveInfo } from 'graphql';
import { Arg, Args, ArgsType, Field, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseResolver, Context } from '../../../../src';
import { UserRoleCreateInput, UserRoleCreateManyArgs, UserRoleWhereArgs, UserRoleWhereInput } from '../../generated';
import { UserRole } from './user-role.entity';
import { User } from './user.entity';
import { Role } from './role.entity';

@Resolver(UserRole)
export class UserRoleResolver extends BaseResolver<UserRole> {
  constructor(@InjectRepository(UserRole) private readonly userRoleRepository: Repository<UserRole>) {
    super(UserRole, userRoleRepository);
  }

  @FieldResolver(returns => User)
  user(@Root() userRole: UserRole, @Ctx() ctx: Context): Promise<User> {
    console.log('userRole: ', userRole);
    return ctx.dataLoader.loaders.UserRole.user.load(userRole);
  }

  @FieldResolver(returns => Role)
  role(@Root() userRole: UserRole, @Ctx() ctx: Context): Promise<Role> {
    console.log('userRole: ', userRole);
    return ctx.dataLoader.loaders.UserRole.role.load(userRole);
  }

  @Query(returns => [UserRole])
  async userRoles(
    @Args() { where, orderBy, limit, offset }: UserRoleWhereArgs,
    @Ctx() ctx: Context,
    info: GraphQLResolveInfo
  ): Promise<UserRole[]> {
    return this.find<UserRoleWhereInput>(where, orderBy, limit, offset);
  }

  @Mutation(returns => UserRole)
  async createUserRole(@Arg('data') data: UserRoleCreateInput, @Ctx() ctx: Context): Promise<UserRole> {
    return this.create(data, ctx.user.id);
  }

  @Mutation(returns => [UserRole])
  async createManyUserRoles(@Args() { data }: UserRoleCreateManyArgs, @Ctx() ctx: Context): Promise<UserRole[]> {
    return this.createMany(data, ctx.user.id);
  }
}
