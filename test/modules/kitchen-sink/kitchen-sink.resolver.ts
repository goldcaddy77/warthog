import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';

import { BaseContext, StandardDeleteResponse, UserId } from '../../../src';
import {
  KitchenSinkCreateInput,
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

  @FieldResolver()
  dishes(@Root() kitchenSink: KitchenSink, @Ctx() ctx: BaseContext): Promise<Dish[]> {
    return ctx.dataLoader.loaders.KitchenSink.dishes.load(kitchenSink);
  }

  @Query(() => [KitchenSink])
  async kitchenSinks(@Args()
  {
    where,
    orderBy,
    limit,
    offset
  }: KitchenSinkWhereArgs): // , @Fields() fields: string[]
  Promise<KitchenSink[]> {
    // TODO: bug in `Fields` - have it remove association records and only keep attributes
    return this.service.find<KitchenSinkWhereInput>(where, orderBy, limit, offset);
  }

  @Query(() => KitchenSink)
  async kitchenSink(@Arg('where') where: KitchenSinkWhereUniqueInput): Promise<KitchenSink> {
    return this.service.findOne<KitchenSinkWhereUniqueInput>(where);
  }

  @Mutation(() => KitchenSink)
  async createKitchenSink(
    @Arg('data') data: KitchenSinkCreateInput,
    @UserId() userId: string
  ): Promise<KitchenSink> {
    return this.service.create(data, userId);
  }

  @Mutation(() => KitchenSink)
  async updateKitchenSink(
    @Args() { data, where }: KitchenSinkUpdateArgs,
    @UserId() userId: string
  ): Promise<KitchenSink> {
    return this.service.update(data, where, userId);
  }

  @Mutation(() => StandardDeleteResponse)
  async deleteKitchenSink(
    @Arg('where') where: KitchenSinkWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}
