import { GraphQLResolveInfo } from 'graphql';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';

import { BaseContext, StandardDeleteResponse } from '../../../../src';
import {
  FeatureFlagUserCreateInput,
  FeatureFlagUserUpdateArgs,
  FeatureFlagUserWhereArgs,
  FeatureFlagUserWhereInput,
  FeatureFlagUserWhereUniqueInput
} from '../../generated';

import { User } from '../user/user.model';

import { FeatureFlagUser } from './feature-flag-user.model';
import { FeatureFlagUserService } from './feature-flag-user.service';

@Resolver(FeatureFlagUser)
export class FeatureFlagUserResolver {
  constructor(@Inject('FeatureFlagUserService') readonly service: FeatureFlagUserService) {
    // no-empty
  }

  @FieldResolver(returns => User)
  user(@Root() featureFlagUser: FeatureFlagUser, @Ctx() ctx: BaseContext): Promise<User> {
    return ctx.dataLoader.loaders.FeatureFlagUser.user.load(featureFlagUser);
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
  async featureFlagUser(@Arg('where') where: FeatureFlagUserWhereUniqueInput): Promise<FeatureFlagUser> {
    return this.service.findOne<FeatureFlagUserWhereUniqueInput>(where);
  }

  @Mutation(returns => FeatureFlagUser)
  async createFeatureFlagUser(
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
