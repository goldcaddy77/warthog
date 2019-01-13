import { GraphQLResolveInfo } from 'graphql';
import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseResolver, Context } from '../../../src';
import { RoleCreateInput, RoleWhereArgs, RoleWhereInput } from '../generated';
import { Role } from './role.entity';

@Resolver(Role)
export class RoleResolver extends BaseResolver<Role> {
  constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) {
    super(Role, roleRepository);
  }

  @Query(returns => [Role])
  async roles(
    @Args() { where, orderBy, limit, offset }: RoleWhereArgs,
    @Ctx() ctx: Context,
    info: GraphQLResolveInfo
  ): Promise<Role[]> {
    return this.find<RoleWhereInput>(where, orderBy, limit, offset);
  }

  @Mutation(returns => Role)
  async createRole(@Arg('data') data: RoleCreateInput, @Ctx() ctx: Context): Promise<Role> {
    return this.create(data, ctx.user.id);
  }
}
