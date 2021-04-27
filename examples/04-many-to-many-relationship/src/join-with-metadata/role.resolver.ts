import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';

import { BaseContext } from '../../../../src';
import { RoleCreateInput, RoleWhereArgs } from '../../generated';
import { Role } from './role.model';
import { RoleService } from './role.service';

@Resolver(Role)
export class RoleResolver {
  constructor(@Inject('RoleService') public readonly service: RoleService) {}

  @Query(() => [Role])
  async roles(@Args() { where, orderBy, limit, offset }: RoleWhereArgs): Promise<Role[]> {
    return this.service.find(where, orderBy, limit, offset);
  }

  @Mutation(() => Role)
  async createRole(@Arg('data') data: RoleCreateInput, @Ctx() ctx: BaseContext): Promise<Role> {
    return this.service.create(data, ctx.user.id);
  }
}
