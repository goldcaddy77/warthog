import { GraphQLResolveInfo } from 'graphql';
import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';

import { BaseContext, StandardDeleteResponse } from '../../../../src';
import {
  FeatureFlagSegmentCreateInput,
  FeatureFlagSegmentUpdateArgs,
  FeatureFlagSegmentWhereArgs,
  FeatureFlagSegmentWhereInput,
  FeatureFlagSegmentWhereUniqueInput
} from '../../generated';

import { FeatureFlagSegment } from './feature-flag-segment.model';
import { FeatureFlagSegmentService } from './feature-flag-segment.service';

@Resolver(FeatureFlagSegment)
export class FeatureFlagSegmentResolver {
  constructor(@Inject('FeatureFlagSegmentService') readonly service: FeatureFlagSegmentService) {
    // no-empty
  }

  @Query(returns => [FeatureFlagSegment])
  async featureFlagSegments(
    @Args() { where, orderBy, limit, offset }: FeatureFlagSegmentWhereArgs,
    @Ctx() ctx: BaseContext,
    info: GraphQLResolveInfo
  ): Promise<FeatureFlagSegment[]> {
    return this.service.find<FeatureFlagSegmentWhereInput>(where, orderBy, limit, offset);
  }

  @Query(returns => FeatureFlagSegment)
  async featureFlagSegment(
    @Arg('where') where: FeatureFlagSegmentWhereUniqueInput
  ): Promise<FeatureFlagSegment> {
    return this.service.findOne<FeatureFlagSegmentWhereUniqueInput>(where);
  }

  @Mutation(returns => FeatureFlagSegment)
  async createFeatureFlagSegment(
    @Arg('data') data: FeatureFlagSegmentCreateInput,
    @Ctx() ctx: BaseContext
  ): Promise<FeatureFlagSegment> {
    return this.service.create(data, ctx.user.id);
  }

  @Mutation(returns => FeatureFlagSegment)
  async updateFeatureFlagSegment(
    @Args() { data, where }: FeatureFlagSegmentUpdateArgs,
    @Ctx() ctx: BaseContext
  ): Promise<FeatureFlagSegment> {
    return this.service.update(data, where, ctx.user.id);
  }

  @Mutation(returns => StandardDeleteResponse)
  async deleteFeatureFlagSegment(
    @Arg('where') where: FeatureFlagSegmentWhereUniqueInput,
    @Ctx() ctx: BaseContext
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, ctx.user.id);
  }
}
