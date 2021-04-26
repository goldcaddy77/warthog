import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';

import { BaseContext, StandardDeleteResponse, UserId } from '../../../../src';
import {
  ProjectCreateInput,
  ProjectUpdateArgs,
  ProjectWhereArgs,
  ProjectWhereUniqueInput
} from '../../generated';

// import { Environment, FeatureFlag, FeatureFlagSegment, FeatureFlagUser, Segment, UserSegment } from '../models';
import { Environment } from '../environment/environment.model';
import { FeatureFlagSegment } from '../feature-flag-segment/feature-flag-segment.model';
import { FeatureFlagUser } from '../feature-flag-user/feature-flag-user.model';
import { FeatureFlag } from '../feature-flag/feature-flag.model';
import { Segment } from '../segment/segment.model';
import { UserSegment } from '../user-segment/user-segment.model';

import { Project } from './project.model';
import { ProjectService } from './project.service';

@Resolver(Project)
export class ProjectResolver {
  constructor(@Inject('ProjectService') readonly service: ProjectService) {
    // no-empty
  }

  @FieldResolver(() => [Environment])
  environments(@Root() project: Project, @Ctx() ctx: BaseContext): Promise<Environment[]> {
    return ctx.dataLoader.loaders.Project.environments.load(project);
  }

  @FieldResolver(() => [Segment])
  segments(@Root() project: Project, @Ctx() ctx: BaseContext): Promise<Segment[]> {
    return ctx.dataLoader.loaders.Project.segments.load(project);
  }

  @FieldResolver(() => [FeatureFlag])
  featureFlags(@Root() project: Project, @Ctx() ctx: BaseContext): Promise<FeatureFlag[]> {
    return ctx.dataLoader.loaders.Project.featureFlags.load(project);
  }

  @FieldResolver(() => [FeatureFlagUser])
  featureFlagUsers(@Root() project: Project, @Ctx() ctx: BaseContext): Promise<FeatureFlagUser[]> {
    return ctx.dataLoader.loaders.Project.featureFlagUsers.load(project);
  }

  @FieldResolver(() => [FeatureFlagSegment])
  featureFlagSegments(
    @Root() project: Project,
    @Ctx() ctx: BaseContext
  ): Promise<FeatureFlagSegment[]> {
    return ctx.dataLoader.loaders.Project.featureFlagSegments.load(project);
  }

  @FieldResolver(() => [UserSegment])
  userSegments(@Root() project: Project, @Ctx() ctx: BaseContext): Promise<UserSegment[]> {
    return ctx.dataLoader.loaders.Project.userSegments.load(project);
  }

  @Query(() => [Project])
  async projects(@Args() { where, orderBy, limit, offset }: ProjectWhereArgs): Promise<Project[]> {
    return this.service.find(where, orderBy, limit, offset);
  }

  @Query(() => Project)
  async project(@Arg('where') where: ProjectWhereUniqueInput): Promise<Project> {
    return this.service.findOne<ProjectWhereUniqueInput>(where);
  }

  @Mutation(() => Project)
  async createProject(
    @Arg('data') data: ProjectCreateInput,
    @UserId() userId: string
  ): Promise<Project> {
    return this.service.create(data, userId);
  }

  @Mutation(() => Project)
  async updateProject(
    @Args() { data, where }: ProjectUpdateArgs,
    @UserId() userId: string
  ): Promise<Project> {
    return this.service.update(data, where, userId);
  }

  @Mutation(() => StandardDeleteResponse)
  async deleteProject(
    @Arg('where') where: ProjectWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}
