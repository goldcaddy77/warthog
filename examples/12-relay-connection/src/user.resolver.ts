import { Args, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';

import { PageInfo, ConnectionResult } from '../../../src';

import { UserWhereArgs, UserWhereInput } from '../generated';

import { User } from './user.model';
import { UserService } from './user.service';

@ObjectType()
export class UserConnection implements ConnectionResult<User> {
  @Field(() => [User], { nullable: false })
  nodes!: User[];

  @Field(() => PageInfo, { nullable: false })
  pageInfo!: PageInfo;
}

@Resolver(User)
export class UserResolver {
  constructor(@Inject('UserService') readonly service: UserService) {}

  @Query(() => UserConnection)
  async UserConnection(
    @Args() { where, orderBy, limit, offset }: UserWhereArgs
  ): Promise<UserConnection> {
    return this.service.findConnection<UserWhereInput>(where, orderBy, limit, offset);
  }
}
