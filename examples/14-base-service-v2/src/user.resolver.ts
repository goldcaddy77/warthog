import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';

import {
  BaseContext,
  FindOneQuery,
  RawFields,
  StandardDeleteResponse,
  ConnectionQuery
} from '../../../src';

import {
  // UserConnection,
  UserConnectionWhereArgs,
  UserCreateInput,
  UserUpdateArgs,
  UserWhereArgs,
  UserWhereUniqueInput
} from '../generated';

import { User } from './user.model';
import { UserService } from './user.service';

class UserConnection {}
class ConnectionPageInputOptions {}
class UserConnectionWhereArgs extends ConnectionPageInputOptions {}

@Resolver(User)
export class UserResolver {
  constructor(@Inject('UserService') readonly service: UserService) {}

  @FindOneQuery(() => [User])
  @Query(() => [User])
  async users(@Args() { where, orderBy, limit, offset }: UserWhereArgs): Promise<User[]> {
    return this.service.find(where, orderBy, limit, offset);
  }

  //
  //
  //
  //
  //
  // TODO: Ran into the issue where we require *.resolver.ts, but
  // we need to use the generated types in this file, but TypeScript will complain
  // until the generated types are there.  Perhaps codegen should not typecheck at all?
  //
  //
  //

  @ConnectionQuery(() => [User])
  @Query(() => [User])
  async UserConnection(): Promise<any> {
    return 'foo';
  }

  // @ConnectionQuery(() => [User])
  // @Query(() => [UserConnection])
  // async UserConnection(
  //   @Args() { where, orderBy, ...pageOptions }: UserConnectionWhereArgs,
  //   @RawFields() fields: object
  // ): Promise<UserConnection> {
  //   return this.service.findConnection(where, orderBy, pageOptions, fields) as any;
  // }

  @Query(() => User)
  async user(@Arg('where') where: UserWhereUniqueInput): Promise<User> {
    return this.service.findOne<UserWhereUniqueInput>(where);
  }

  @Mutation(() => User)
  async createUser(@Arg('data') data: UserCreateInput, @Ctx() ctx: BaseContext): Promise<User> {
    return this.service.create(data, ctx.user.id);
  }

  @Mutation(() => User)
  async updateUser(
    @Args() { data, where }: UserUpdateArgs,
    @Ctx() ctx: BaseContext
  ): Promise<User> {
    return this.service.update(data, where, ctx.user.id);
  }

  @Mutation(() => StandardDeleteResponse)
  async deleteUser(
    @Arg('where') where: UserWhereUniqueInput,
    @Ctx() ctx: BaseContext
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, ctx.user.id);
  }
}
