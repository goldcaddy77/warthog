import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';

import { StandardDeleteResponse, UserId } from '@warthog/core';
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

  @Query(() => [FeatureFlagSegment])
  async featureFlagSegments(@Args()
  {
    where,
    orderBy,
    limit,
    offset
  }: FeatureFlagSegmentWhereArgs): Promise<FeatureFlagSegment[]> {
    return this.service.find<FeatureFlagSegmentWhereInput>(where, orderBy, limit, offset);
  }

  @Query(() => FeatureFlagSegment)
  async featureFlagSegment(
    @Arg('where') where: FeatureFlagSegmentWhereUniqueInput
  ): Promise<FeatureFlagSegment> {
    return this.service.findOne<FeatureFlagSegmentWhereUniqueInput>(where);
  }

  @Mutation(() => FeatureFlagSegment)
  async createFeatureFlagSegment(
    @Arg('data') data: FeatureFlagSegmentCreateInput,
    @UserId() userId: string
  ): Promise<FeatureFlagSegment> {
    return this.service.create(data, userId);
  }

  @Mutation(() => FeatureFlagSegment)
  async updateFeatureFlagSegment(
    @Args() { data, where }: FeatureFlagSegmentUpdateArgs,
    @UserId() userId: string
  ): Promise<FeatureFlagSegment> {
    return this.service.update(data, where, userId);
  }

  @Mutation(() => StandardDeleteResponse)
  async deleteFeatureFlagSegment(
    @Arg('where') where: FeatureFlagSegmentWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}
