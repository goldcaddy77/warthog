import { GraphQLResolveInfo } from 'graphql';
import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseResolver, Context, StandardDeleteResponse } from '../../../../src';
import {
  UserCreateInput,
  UserUpdateArgs,
  UserWhereArgs,
  UserWhereInput,
  UserWhereUniqueInput
} from '../../../generated';

import { User } from './user.entity';

// Note: we have to specify `User` here instead of (of => User) because for some reason this
// changes the object reference when it's trying to add the FieldResolver and things break
@Resolver(User)
export class UserResolver extends BaseResolver<User> {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
    super(User, userRepository);

    // or else it complains about userRepository not being used
    console.log.call(null, typeof this.userRepository);
  }

  @Query(returns => [User])
  async users(
    @Args() { where, orderBy, limit, offset }: UserWhereArgs,
    @Ctx() ctx: Context,
    info: GraphQLResolveInfo
  ): Promise<User[]> {
    return this.find<UserWhereInput>(where, orderBy, limit, offset);
  }

  @Authorized('user:read')
  @Query(returns => User)
  async user(@Arg('where') where: UserWhereUniqueInput): Promise<User> {
    return this.findOne<UserWhereUniqueInput>(where);
  }

  @Authorized('user:create')
  @Mutation(returns => User)
  async createUser(@Arg('data') data: UserCreateInput, @Ctx() ctx: Context): Promise<User> {
    return this.create(data, ctx.user.id);
  }

  @Authorized('user:update')
  @Mutation(returns => User)
  async updateUser(@Args() { data, where }: UserUpdateArgs, @Ctx() ctx: Context): Promise<User> {
    return this.update(data, where, ctx.user.id);
  }

  // @Authorized('user:delete')
  @Mutation(returns => StandardDeleteResponse)
  async deleteUser(@Arg('where') where: UserWhereUniqueInput, @Ctx() ctx: Context): Promise<StandardDeleteResponse> {
    return this.delete(where, ctx.user.id);
  }
}
