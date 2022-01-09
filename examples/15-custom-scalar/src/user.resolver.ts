import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { BaseContext } from '../../../src';
import { UserCreateInput, UserWhereArgs } from '../generated';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(User)
export class UserResolver {
  constructor(@Inject('UserService') readonly service: UserService) {}

  @Query(() => [User])
  async users(@Args() { where, orderBy, limit, offset }: UserWhereArgs): Promise<User[]> {
    return this.service.find(where, orderBy, limit, offset);
  }

  @Mutation(() => User)
  async createUser(@Arg('data') data: UserCreateInput, @Ctx() ctx: BaseContext): Promise<User> {
    return this.service.create(data, ctx.user.id);
  }
}
