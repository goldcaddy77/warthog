import { GraphQLResolveInfo } from 'graphql';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';

import { BaseContext, StandardDeleteResponse } from '../../../../src';
import {
  FeatureFlagCreateInput,
  FeatureFlagUpdateArgs,
  FeatureFlagWhereArgs,
  FeatureFlagWhereInput,
  FeatureFlagWhereUniqueInput
} from '../../generated';

import { FeatureFlagUser } from '../feature-flag-user/feature-flag-user.model';
import { Project } from '../project/project.model';

import { FeatureFlag } from './feature-flag.model';
import { FeatureFlagService } from './feature-flag.service';

@Resolver(FeatureFlag)
export class FeatureFlagResolver {
  constructor(@Inject('FeatureFlagService') readonly service: FeatureFlagService) {
    // tslint
  }

  @FieldResolver(returns => Project)
  project(@Root() featureFlag: FeatureFlag, @Ctx() ctx: BaseContext): Promise<Project> {
    return ctx.dataLoader.loaders.FeatureFlag.project.load(featureFlag);
  }

  @FieldResolver(returns => [FeatureFlagUser])
  featureFlagUsers(@Root() featureFlag: FeatureFlag, @Ctx() ctx: BaseContext): Promise<FeatureFlagUser[]> {
    return ctx.dataLoader.loaders.FeatureFlag.featureFlagUsers.load(featureFlag);
  }

  @Query(returns => [FeatureFlag])
  async featureFlags(
    @Args() { where, orderBy, limit, offset }: FeatureFlagWhereArgs,
    @Ctx() ctx: BaseContext,
    info: GraphQLResolveInfo
  ): Promise<FeatureFlag[]> {
    return this.service.find<FeatureFlagWhereInput>(where, orderBy, limit, offset);
  }

  @Query(returns => FeatureFlag)
  async featureFlag(@Arg('where') where: FeatureFlagWhereUniqueInput): Promise<FeatureFlag> {
    return this.service.findOne<FeatureFlagWhereUniqueInput>(where);
  }

  @Mutation(returns => FeatureFlag)
  async createFeatureFlag(@Arg('data') data: FeatureFlagCreateInput, @Ctx() ctx: BaseContext): Promise<FeatureFlag> {
    return this.service.create(data, ctx.user.id);
  }

  @Mutation(returns => FeatureFlag)
  async updateFeatureFlag(
    @Args() { data, where }: FeatureFlagUpdateArgs,
    @Ctx() ctx: BaseContext
  ): Promise<FeatureFlag> {
    return this.service.update(data, where, ctx.user.id);
  }

  @Mutation(returns => StandardDeleteResponse)
  async deleteFeatureFlag(
    @Arg('where') where: FeatureFlagWhereUniqueInput,
    @Ctx() ctx: BaseContext
  ): Promise<StandardDeleteResponse> {
    // TODO: deletes across all environments.  Just takes project key and flag key
    return this.service.delete(where, ctx.user.id);
  }
}
