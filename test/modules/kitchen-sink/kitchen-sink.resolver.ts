import {
  Arg,
  Args,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from 'type-graphql';
import { Inject } from 'typedi';

import { BaseContext, StandardDeleteResponse, UserId } from '../../../src';
import {
  KitchenSinkCreateInput,
  KitchenSinkCreateManyArgs,
  KitchenSinkUpdateArgs,
  KitchenSinkWhereArgs,
  KitchenSinkWhereInput,
  KitchenSinkWhereUniqueInput
} from '../../generated';

import { Dish } from '../dish/dish.model';

import { KitchenSink } from './kitchen-sink.model';
import { KitchenSinkService } from './kitchen-sink.service';

@Resolver(KitchenSink)
export class KitchenSinkResolver {
  constructor(@Inject('KitchenSinkService') public readonly service: KitchenSinkService) {}

  // @Authorized('dish:read')
  @FieldResolver()
  dishes(@Root() kitchenSink: KitchenSink, @Ctx() ctx: BaseContext): Promise<Dish[]> {
    return ctx.dataLoader.loaders.KitchenSink.dishes.load(kitchenSink);
  }

  @Authorized('kitchenSink:read')
  @Query(() => [KitchenSink])
  async kitchenSinks(
    @Args()
    { where, orderBy, limit, offset }: KitchenSinkWhereArgs,
    @Fields() fields: string[]
  ): Promise<KitchenSink[]> {
    return this.service.find<KitchenSinkWhereInput>(where, orderBy, limit, offset, fields);
  }

  @Authorized('kitchenSink:read')
  @Query(() => KitchenSink)
  async kitchenSink(@Arg('where') where: KitchenSinkWhereUniqueInput): Promise<KitchenSink> {
    return this.service.findOne<KitchenSinkWhereUniqueInput>(where);
  }

  @Authorized('kitchenSink:create')
  @Mutation(() => KitchenSink)
  async createKitchenSink(
    @Arg('data') data: KitchenSinkCreateInput,
    @UserId() userId: string
  ): Promise<KitchenSink> {
    return this.service.create(data, userId);
  }

  @Authorized('kitchenSink:create')
  @Mutation(() => [KitchenSink])
  async createManyKitchenSinks(
    @Args() { data }: KitchenSinkCreateManyArgs,
    @UserId() userId: string
  ): Promise<KitchenSink[]> {
    return this.service.createMany(data, userId);
  }

  @Authorized('kitchenSink:update')
  @Mutation(() => KitchenSink)
  async updateKitchenSink(
    @Args() { data, where }: KitchenSinkUpdateArgs,
    @UserId() userId: string
  ): Promise<KitchenSink> {
    return this.service.update(data, where, userId);
  }

  @Authorized('kitchenSink:delete')
  @Mutation(() => StandardDeleteResponse)
  async deleteKitchenSink(
    @Arg('where') where: KitchenSinkWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}
