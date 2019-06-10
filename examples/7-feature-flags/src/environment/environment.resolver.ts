import { GraphQLResolveInfo } from 'graphql';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';

import { BaseContext, StandardDeleteResponse } from '../../../../src';
import {
  EnvironmentCreateInput,
  EnvironmentUpdateArgs,
  EnvironmentWhereArgs,
  EnvironmentWhereInput,
  EnvironmentWhereUniqueInput
} from '../../generated';

import { FeatureFlagUser } from '../feature-flag-user/feature-flag-user.model';
import { Project } from '../project/project.model';
import { Segment } from '../segment/segment.model';

import { Environment } from './environment.model';
import { EnvironmentService } from './environment.service';

@Resolver(Environment)
export class EnvironmentResolver {
  constructor(@Inject('EnvironmentService') readonly service: EnvironmentService) {
    // tslint
  }

  @FieldResolver(returns => Project)
  project(@Root() environment: Environment, @Ctx() ctx: BaseContext): Promise<Project> {
    return ctx.dataLoader.loaders.Environment.project.load(environment);
  }

  @FieldResolver(returns => [Segment])
  segments(@Root() environment: Environment, @Ctx() ctx: BaseContext): Promise<Segment[]> {
    return ctx.dataLoader.loaders.Environment.segments.load(environment);
  }

  @FieldResolver(returns => [FeatureFlagUser])
  featureFlagUsers(@Root() environment: Environment, @Ctx() ctx: BaseContext): Promise<FeatureFlagUser[]> {
    return ctx.dataLoader.loaders.Environment.featureFlagUsers.load(environment);
  }

  @Query(returns => [Environment])
  async environments(
    @Args() { where, orderBy, limit, offset }: EnvironmentWhereArgs,
    @Ctx() ctx: BaseContext,
    info: GraphQLResolveInfo
  ): Promise<Environment[]> {
    return this.service.find<EnvironmentWhereInput>(where, orderBy, limit, offset);
  }

  @Query(returns => Environment)
  async environment(@Arg('where') where: EnvironmentWhereUniqueInput): Promise<Environment> {
    return this.service.findOne<EnvironmentWhereUniqueInput>(where);
  }

  @Mutation(returns => Environment)
  async createEnvironment(@Arg('data') data: EnvironmentCreateInput, @Ctx() ctx: BaseContext): Promise<Environment> {
    return this.service.create(data, ctx.user.id);
  }

  @Mutation(returns => Environment)
  async updateEnvironment(
    @Args() { data, where }: EnvironmentUpdateArgs,
    @Ctx() ctx: BaseContext
  ): Promise<Environment> {
    return this.service.update(data, where, ctx.user.id);
  }

  @Mutation(returns => StandardDeleteResponse)
  async deleteEnvironment(
    @Arg('where') where: EnvironmentWhereUniqueInput,
    @Ctx() ctx: BaseContext
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, ctx.user.id);
  }
}
