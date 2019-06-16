import { GraphQLResolveInfo } from 'graphql';
import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseContext, BaseResolver } from '../../../../src';
import { RoleCreateInput, RoleWhereArgs, RoleWhereInput } from '../../generated';
import { Role } from './role.model';

@Resolver(Role)
export class RoleResolver extends BaseResolver<Role> {
  constructor(@InjectRepository(Role) public readonly roleRepository: Repository<Role>) {
    super(Role, roleRepository);
  }

  @Query(returns => [Role])
  async roles(
    @Args() { where, orderBy, limit, offset }: RoleWhereArgs,
    @Ctx() ctx: BaseContext,
    info: GraphQLResolveInfo
  ): Promise<Role[]> {
    return this.find<RoleWhereInput>(where, orderBy, limit, offset);
  }

  @Mutation(returns => Role)
  async createRole(@Arg('data') data: RoleCreateInput, @Ctx() ctx: BaseContext): Promise<Role> {
    return this.create(data, ctx.user.id);
  }
}
