import { BaseService, StandardDeleteResponse } from '@warthog/core';
import { BaseContext } from '@warthog/server-express';

import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Container, Inject } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import {
  UserCreateInput,
  UserUpdateArgs,
  UserWhereArgs,
  UserWhereInput,
  UserWhereUniqueInput
} from '../generated';

import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(User)
export class UserResolver {
  localService: BaseService<User>;
  subclassedService: UserService;

  constructor(
    @InjectRepository(User) public readonly userRepository: Repository<User>,
    @Inject('UserService') readonly injectedService: UserService
  ) {
    // Option 1: Create service like this in the resolver
    this.localService = new BaseService<User>(User, userRepository);

    // Option 2: Create service like this in the resolver
    this.subclassedService = Container.get(UserService);

    // Option 3: Injected service
    this.injectedService = injectedService;
  }

  @Query(() => [User])
  async users(@Args() { where, orderBy, limit, offset }: UserWhereArgs): Promise<User[]> {
    return this.injectedService.find<UserWhereInput>(where, orderBy, limit, offset);
  }

  @Query(() => User)
  async user(@Arg('where') where: UserWhereUniqueInput): Promise<User> {
    return this.localService.findOne<UserWhereUniqueInput>(where);
  }

  @Mutation(() => User)
  async createUser(@Arg('data') data: UserCreateInput, @Ctx() ctx: BaseContext): Promise<User> {
    return this.subclassedService.create(data, ctx.user.id);
  }

  @Mutation(() => User)
  async updateUser(
    @Args() { data, where }: UserUpdateArgs,
    @Ctx() ctx: BaseContext
  ): Promise<User> {
    return this.localService.update(data, where, ctx.user.id);
  }

  @Mutation(() => StandardDeleteResponse)
  async deleteUser(
    @Arg('where') where: UserWhereUniqueInput,
    @Ctx() ctx: BaseContext
  ): Promise<StandardDeleteResponse> {
    return this.localService.delete(where, ctx.user.id);
  }
}
