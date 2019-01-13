import { GraphQLResolveInfo } from 'graphql';
import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseResolver, Context } from '../../../src';
import { UserRoleCreateInput, UserRoleWhereArgs, UserRoleWhereInput } from '../generated';
import { UserRole } from './user-role.entity';

@Resolver(UserRole)
export class UserRoleResolver extends BaseResolver<UserRole> {
  constructor(@InjectRepository(UserRole) private readonly userRoleRepository: Repository<UserRole>) {
    super(UserRole, userRoleRepository);
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
}
