// import { GraphQLResolveInfo } from 'graphql';
import { Arg, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';

import { UserWhereUniqueInput } from '../../generated';

import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(User)
export class UserResolver {
  constructor(@Inject('UserService') readonly service: UserService) {
    // tslint
  }

  @Query(returns => User)
  async user(@Arg('where') where: UserWhereUniqueInput): Promise<User> {
    return this.service.findOne<UserWhereUniqueInput>(where);
  }
}
