import { Arg, Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Inject } from 'typedi';

import { StandardDeleteResponse, UserId } from '../../../../src';
import {
  UserSegmentCreateInput,
  UserSegmentUpdateArgs,
  UserSegmentWhereArgs,
  UserSegmentWhereUniqueInput
} from '../../generated';

import { UserSegment } from './user-segment.model';
import { UserSegmentService } from './user-segment.service';

@Resolver(UserSegment)
export class UserSegmentResolver {
  constructor(@Inject('UserSegmentService') readonly service: UserSegmentService) {
    // no-empty
  }

  @Query(() => [UserSegment])
  async userSegments(
    @Args() { where, orderBy, limit, offset }: UserSegmentWhereArgs
  ): Promise<UserSegment[]> {
    return this.service.find(where, orderBy, limit, offset);
  }

  @Query(() => UserSegment)
  async userSegment(@Arg('where') where: UserSegmentWhereUniqueInput): Promise<UserSegment> {
    return this.service.findOne<UserSegmentWhereUniqueInput>(where);
  }

  @Mutation(() => UserSegment)
  async createUserSegment(
    @Arg('data') data: UserSegmentCreateInput,
    @UserId() userId: string
  ): Promise<UserSegment> {
    return this.service.create(data, userId);
  }

  @Mutation(() => UserSegment)
  async updateUserSegment(
    @Args() { data, where }: UserSegmentUpdateArgs,
    @UserId() userId: string
  ): Promise<UserSegment> {
    return this.service.update(data, where, userId);
  }

  @Mutation(() => StandardDeleteResponse)
  async deleteUserSegment(
    @Arg('where') where: UserSegmentWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}
