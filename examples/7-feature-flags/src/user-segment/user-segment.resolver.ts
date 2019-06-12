import { GraphQLResolveInfo } from 'graphql';
import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';

import { BaseContext, StandardDeleteResponse } from '../../../../src';
import {
  UserSegmentCreateInput,
  UserSegmentUpdateArgs,
  UserSegmentWhereArgs,
  UserSegmentWhereInput,
  UserSegmentWhereUniqueInput
} from '../../generated';

import { UserSegment } from './user-segment.model';
import { UserSegmentService } from './user-segment.service';

@Resolver(UserSegment)
export class UserSegmentResolver {
  constructor(@Inject('UserSegmentService') readonly service: UserSegmentService) {
    // no-empty
  }

  @Query(returns => [UserSegment])
  async userSegments(
    @Args() { where, orderBy, limit, offset }: UserSegmentWhereArgs,
    @Ctx() ctx: BaseContext,
    info: GraphQLResolveInfo
  ): Promise<UserSegment[]> {
    return this.service.find<UserSegmentWhereInput>(where, orderBy, limit, offset);
  }

  @Query(returns => UserSegment)
  async userSegment(@Arg('where') where: UserSegmentWhereUniqueInput): Promise<UserSegment> {
    return this.service.findOne<UserSegmentWhereUniqueInput>(where);
  }

  @Mutation(returns => UserSegment)
  async createUserSegment(
    @Arg('data') data: UserSegmentCreateInput,
    @Ctx() ctx: BaseContext
  ): Promise<UserSegment> {
    return this.service.create(data, ctx.user.id);
  }

  @Mutation(returns => UserSegment)
  async updateUserSegment(
    @Args() { data, where }: UserSegmentUpdateArgs,
    @Ctx() ctx: BaseContext
  ): Promise<UserSegment> {
    return this.service.update(data, where, ctx.user.id);
  }

  @Mutation(returns => StandardDeleteResponse)
  async deleteUserSegment(
    @Arg('where') where: UserSegmentWhereUniqueInput,
    @Ctx() ctx: BaseContext
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, ctx.user.id);
  }
}
