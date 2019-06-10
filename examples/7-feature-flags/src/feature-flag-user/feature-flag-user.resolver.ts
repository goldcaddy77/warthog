import { GraphQLResolveInfo } from 'graphql';
import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';

import { BaseContext, StandardDeleteResponse } from '../../../../src';
import {
  FeatureFlagUserCreateInput,
  FeatureFlagUserUpdateArgs,
  FeatureFlagUserWhereArgs,
  FeatureFlagUserWhereInput,
  FeatureFlagUserWhereUniqueInput
} from '../../generated';

import { FeatureFlagUser } from './feature-flag-user.model';
import { FeatureFlagUserService } from './feature-flag-user.service';

@Resolver(FeatureFlagUser)
export class UserResolver {
  constructor(@Inject('UserService') readonly service: FeatureFlagUserService) {
    // no-empty
  }

  @Query(returns => [FeatureFlagUser])
  async featureFlagUsers(
    @Args() { where, orderBy, limit, offset }: FeatureFlagUserWhereArgs,
    @Ctx() ctx: BaseContext,
    info: GraphQLResolveInfo
  ): Promise<FeatureFlagUser[]> {
    return this.service.find<FeatureFlagUserWhereInput>(where, orderBy, limit, offset);
  }

  @Query(returns => FeatureFlagUser)
  async featureFlagUser(
    @Arg('where') where: FeatureFlagUserWhereUniqueInput
  ): Promise<FeatureFlagUser> {
    return this.service.findOne<FeatureFlagUserWhereUniqueInput>(where);
  }

  @Mutation(returns => FeatureFlagUser)
  async createFeatureFlagUsers(
    @Arg('data') data: FeatureFlagUserCreateInput,
    @Ctx() ctx: BaseContext
  ): Promise<FeatureFlagUser> {
    return this.service.create(data, ctx.user.id);
  }

  @Mutation(returns => FeatureFlagUser)
  async updateFeatureFlagUser(
    @Args() { data, where }: FeatureFlagUserUpdateArgs,
    @Ctx() ctx: BaseContext
  ): Promise<FeatureFlagUser> {
    return this.service.update(data, where, ctx.user.id);
  }

  @Mutation(returns => StandardDeleteResponse)
  async deleteFeatureFlagUser(
    @Arg('where') where: FeatureFlagUserWhereUniqueInput,
    @Ctx() ctx: BaseContext
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, ctx.user.id);
  }
}
