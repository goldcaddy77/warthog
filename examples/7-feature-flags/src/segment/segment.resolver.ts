import { GraphQLResolveInfo } from 'graphql';
import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';

import { BaseContext, StandardDeleteResponse } from '../../../../src';
import {
  SegmentCreateInput,
  SegmentUpdateArgs,
  SegmentWhereArgs,
  SegmentWhereInput,
  SegmentWhereUniqueInput
} from '../../generated';

import { Segment } from './segment.model';
import { SegmentService } from './segment.service';

@Resolver(Segment)
export class FeatureFlagSegmentResolver {
  constructor(@Inject('SegmentService') readonly service: SegmentService) {
    // no-empty
  }

  @Query(returns => [Segment])
  async segments(
    @Args() { where, orderBy, limit, offset }: SegmentWhereArgs,
    @Ctx() ctx: BaseContext,
    info: GraphQLResolveInfo
  ): Promise<Segment[]> {
    return this.service.find<SegmentWhereInput>(where, orderBy, limit, offset);
  }

  @Query(returns => Segment)
  async segment(@Arg('where') where: SegmentWhereUniqueInput): Promise<Segment> {
    return this.service.findOne<SegmentWhereUniqueInput>(where);
  }

  @Mutation(returns => Segment)
  async createSegment(
    @Arg('data') data: SegmentCreateInput,
    @Ctx() ctx: BaseContext
  ): Promise<Segment> {
    return this.service.create(data, ctx.user.id);
  }

  @Mutation(returns => Segment)
  async updateSegment(
    @Args() { data, where }: SegmentUpdateArgs,
    @Ctx() ctx: BaseContext
  ): Promise<Segment> {
    return this.service.update(data, where, ctx.user.id);
  }

  @Mutation(returns => StandardDeleteResponse)
  async deleteSegment(
    @Arg('where') where: SegmentWhereUniqueInput,
    @Ctx() ctx: BaseContext
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, ctx.user.id);
  }
}
