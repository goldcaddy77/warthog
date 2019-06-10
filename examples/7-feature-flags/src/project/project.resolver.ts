import { GraphQLResolveInfo } from 'graphql';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';

import { BaseContext, StandardDeleteResponse } from '../../../../src';
import {
  ProjectCreateInput,
  ProjectUpdateArgs,
  ProjectWhereArgs,
  ProjectWhereInput,
  ProjectWhereUniqueInput
} from '../../generated';

import { Environment } from '../environment/environment.model';
import { Segment } from '../segment/segment.model';

import { Project } from './project.model';
import { ProjectService } from './project.service';

@Resolver(Project)
export class FeatureFlagProjectResolver {
  constructor(@Inject('ProjectService') readonly service: ProjectService) {
    // no-empty
  }

  @FieldResolver(returns => [Environment])
  environments(@Root() project: Project, @Ctx() ctx: BaseContext): Promise<Environment[]> {
    return ctx.dataLoader.loaders.Project.environments.load(project);
  }

  @FieldResolver(returns => [Segment])
  segments(@Root() project: Project, @Ctx() ctx: BaseContext): Promise<Segment[]> {
    return ctx.dataLoader.loaders.Project.segments.load(project);
  }

  @Query(returns => [Project])
  async projects(
    @Args() { where, orderBy, limit, offset }: ProjectWhereArgs,
    @Ctx() ctx: BaseContext,
    info: GraphQLResolveInfo
  ): Promise<Project[]> {
    return this.service.find<ProjectWhereInput>(where, orderBy, limit, offset);
  }

  @Query(returns => Project)
  async project(@Arg('where') where: ProjectWhereUniqueInput): Promise<Project> {
    return this.service.findOne<ProjectWhereUniqueInput>(where);
  }

  @Mutation(returns => Project)
  async createProject(@Arg('data') data: ProjectCreateInput, @Ctx() ctx: BaseContext): Promise<Project> {
    return this.service.create(data, ctx.user.id);
  }

  @Mutation(returns => Project)
  async updateProject(@Args() { data, where }: ProjectUpdateArgs, @Ctx() ctx: BaseContext): Promise<Project> {
    return this.service.update(data, where, ctx.user.id);
  }

  @Mutation(returns => StandardDeleteResponse)
  async deleteProject(
    @Arg('where') where: ProjectWhereUniqueInput,
    @Ctx() ctx: BaseContext
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, ctx.user.id);
  }
}
