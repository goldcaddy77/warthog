import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';

import { BaseContext, StandardDeleteResponse, UserId } from '../../../../src';
import {
  EnvironmentCreateInput,
  EnvironmentUpdateArgs,
  EnvironmentWhereArgs,
  EnvironmentWhereInput,
  EnvironmentWhereUniqueInput
} from '../../generated';

// import { FeatureFlagSegment, FeatureFlagUser, Project, Segment, UserSegment } from '../models';
import { FeatureFlagSegment } from '../feature-flag-segment/feature-flag-segment.model';
import { FeatureFlagUser } from '../feature-flag-user/feature-flag-user.model';
import { Project } from '../project/project.model';
import { Segment } from '../segment/segment.model';
import { UserSegment } from '../user-segment/user-segment.model';

import { Environment } from './environment.model';
import { EnvironmentService } from './environment.service';

@Resolver(Environment)
export class EnvironmentResolver {
  constructor(@Inject('EnvironmentService') readonly service: EnvironmentService) {}

  @FieldResolver(() => Project)
  project(@Root() environment: Environment, @Ctx() ctx: BaseContext): Promise<Project> {
    return ctx.dataLoader.loaders.Environment.project.load(environment);
  }

  @FieldResolver(() => [Segment])
  segments(@Root() environment: Environment, @Ctx() ctx: BaseContext): Promise<Segment[]> {
    return ctx.dataLoader.loaders.Environment.segments.load(environment);
  }

  @FieldResolver(() => [FeatureFlagUser])
  featureFlagUsers(
    @Root() environment: Environment,
    @Ctx() ctx: BaseContext
  ): Promise<FeatureFlagUser[]> {
    return ctx.dataLoader.loaders.Environment.featureFlagUsers.load(environment);
  }

  @FieldResolver(() => [FeatureFlagSegment])
  featureFlagSegments(
    @Root() environment: Environment,
    @Ctx() ctx: BaseContext
  ): Promise<FeatureFlagSegment[]> {
    return ctx.dataLoader.loaders.Environment.featureFlagSegments.load(environment);
  }

  @FieldResolver(() => [UserSegment])
  userSegments(@Root() environment: Environment, @Ctx() ctx: BaseContext): Promise<UserSegment[]> {
    return ctx.dataLoader.loaders.Environment.userSegments.load(environment);
  }

  @Query(() => [Environment])
  async environments(@Args() { where, orderBy, limit, offset }: EnvironmentWhereArgs): Promise<
    Environment[]
  > {
    return this.service.find<EnvironmentWhereInput>(where, orderBy, limit, offset);
  }

  @Query(() => Environment)
  async environment(@Arg('where') where: EnvironmentWhereUniqueInput): Promise<Environment> {
    return this.service.findOne<EnvironmentWhereUniqueInput>(where);
  }

  @Mutation(() => Environment)
  async createEnvironment(
    @Arg('data') data: EnvironmentCreateInput,
    @UserId() userId: string
  ): Promise<Environment> {
    return this.service.create(data, userId);
  }

  @Mutation(() => Environment)
  async updateEnvironment(
    @Args() { data, where }: EnvironmentUpdateArgs,
    @UserId() userId: string
  ): Promise<Environment> {
    return this.service.update(data, where, userId);
  }

  @Mutation(() => StandardDeleteResponse)
  async deleteEnvironment(
    @Arg('where') where: EnvironmentWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}
