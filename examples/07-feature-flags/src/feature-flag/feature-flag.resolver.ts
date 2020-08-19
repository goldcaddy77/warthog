import {
  Arg,
  Args,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  Query,
  Resolver,
  Root
} from 'type-graphql';
import { Inject } from 'typedi';

import { StandardDeleteResponse, UserId } from '@warthog/core';
import { BaseContext } from '@warthog/server-express';
import {
  FeatureFlagCreateInput,
  FeatureFlagUpdateArgs,
  FeatureFlagWhereArgs,
  FeatureFlagWhereInput,
  FeatureFlagWhereUniqueInput
} from '../../generated';

import { FeatureFlagSegment } from '../feature-flag-segment/feature-flag-segment.model';
import { FeatureFlagUser } from '../feature-flag-user/feature-flag-user.model';
import { Project } from '../project/project.model';

import { FeatureFlag } from './feature-flag.model';
import { FeatureFlagService } from './feature-flag.service';

@InputType()
export class FeatureFlagsForUserInput {
  @Field(() => String)
  projKey: string;

  @Field(() => String)
  envKey: string;

  @Field(() => String)
  userKey: string;
}

@Resolver(FeatureFlag)
export class FeatureFlagResolver {
  constructor(@Inject('FeatureFlagService') readonly service: FeatureFlagService) {}

  @FieldResolver(() => Project)
  project(@Root() featureFlag: FeatureFlag, @Ctx() ctx: BaseContext): Promise<Project> {
    return ctx.dataLoader.loaders.FeatureFlag.project.load(featureFlag);
  }

  @FieldResolver(() => [FeatureFlagSegment])
  featureFlagSegments(
    @Root() featureFlag: FeatureFlag,
    @Ctx() ctx: BaseContext
  ): Promise<FeatureFlagSegment[]> {
    return ctx.dataLoader.loaders.FeatureFlag.featureFlagSegments.load(featureFlag);
  }

  @FieldResolver(() => [FeatureFlagUser])
  featureFlagUsers(
    @Root() featureFlag: FeatureFlag,
    @Ctx() ctx: BaseContext
  ): Promise<FeatureFlagUser[]> {
    return ctx.dataLoader.loaders.FeatureFlag.featureFlagUsers.load(featureFlag);
  }

  @Query(() => [FeatureFlag])
  async featureFlags(@Args() { where, orderBy, limit, offset }: FeatureFlagWhereArgs): Promise<
    FeatureFlag[]
  > {
    return this.service.find<FeatureFlagWhereInput>(where, orderBy, limit, offset);
  }

  // Custom resolver that has it's own InputType and calls into custom service method
  @Query(() => [String])
  async featureFlagsForUser(@Arg('where') where: FeatureFlagsForUserInput): Promise<string[]> {
    return this.service.flagsForUser(where);
  }

  @Query(() => FeatureFlag)
  async featureFlag(@Arg('where') where: FeatureFlagWhereUniqueInput): Promise<FeatureFlag> {
    return this.service.findOne<FeatureFlagWhereUniqueInput>(where);
  }

  @Mutation(() => FeatureFlag)
  async createFeatureFlag(
    @Arg('data') data: FeatureFlagCreateInput,
    @UserId() userId: string
  ): Promise<FeatureFlag> {
    return this.service.create(data, userId);
  }

  @Mutation(() => FeatureFlag)
  async updateFeatureFlag(
    @Args() { data, where }: FeatureFlagUpdateArgs,
    @UserId() userId: string
  ): Promise<FeatureFlag> {
    return this.service.update(data, where, userId);
  }

  @Mutation(() => StandardDeleteResponse)
  async deleteFeatureFlag(
    @Arg('where') where: FeatureFlagWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    // TODO: deletes across all environments.  Just takes project key and flag key
    return this.service.delete(where, userId);
  }
}
