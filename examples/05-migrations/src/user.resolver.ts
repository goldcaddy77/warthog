import { Args, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';

import { UserWhereArgs } from '../generated';

import { User } from './user.model';
import { UserService } from './user.service';

// Note: we have to specify `User` here instead of (() => User) because for some reason this
// changes the object reference when it's trying to add the FieldResolver and things break
@Resolver(User)
export class UserResolver {
  constructor(@Inject('UserService') public readonly service: UserService) {}

  @Query(() => [User])
  async users(@Args() { where, orderBy, limit, offset }: UserWhereArgs): Promise<User[]> {
    return this.service.find(where, orderBy, limit, offset);
  }
}
