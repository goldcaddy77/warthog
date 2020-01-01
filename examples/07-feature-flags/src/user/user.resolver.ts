// import { GraphQLResolveInfo } from 'graphql';
import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';

import { BaseContext } from '@warthog/core';

import { UserWhereUniqueInput } from '../../generated';

import { UserSegment } from '../user-segment/user-segment.model';

import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(User)
export class UserResolver {
  constructor(@Inject('UserService') readonly service: UserService) {}

  @FieldResolver(() => [UserSegment])
  userSegments(@Root() user: User, @Ctx() ctx: BaseContext): Promise<UserSegment[]> {
    return ctx.dataLoader.loaders.User.userSegments.load(user);
  }

  @Query(() => User)
  async user(@Arg('where') where: UserWhereUniqueInput): Promise<User> {
    return this.service.findOne<UserWhereUniqueInput>(where);
  }
}
