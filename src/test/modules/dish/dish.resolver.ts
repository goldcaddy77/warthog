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

import { BaseContext, Fields, StandardDeleteResponse, UserId } from '../../../';
import {
  DishCreateInput,
  DishCreateManyArgs,
  DishUpdateArgs,
  DishWhereArgs,
  DishWhereInput,
  DishWhereUniqueInput
} from '../../generated';

import { KitchenSink } from '../kitchen-sink/kitchen-sink.model';

import { Dish } from './dish.model';
import { DishService } from './dish.service';

@Resolver(Dish)
export class DishResolver {
  constructor(@Inject('DishService') public readonly service: DishService) {}

  @Authorized('kitchenSink:read')
  @FieldResolver(() => KitchenSink)
  kitchenSink(@Root() dish: Dish, @Ctx() ctx: BaseContext): Promise<KitchenSink> {
    return ctx.dataLoader.loaders.Dish.kitchenSink.load(dish);
  }

  @Authorized('dish:read')
  @Query(() => [Dish])
  async dishes(
    @Args() { where, orderBy, limit, offset }: DishWhereArgs,
    @Fields() fields: string[]
  ): Promise<Dish[]> {
    return this.service.find<DishWhereInput>(where, orderBy, limit, offset, fields);
  }

  @Authorized('dish:read')
  @Query(() => Dish)
  async dish(@Arg('where') where: DishWhereUniqueInput): Promise<Dish> {
    return this.service.findOne<DishWhereUniqueInput>(where);
  }

  @Authorized('dish:create')
  @Mutation(() => Dish)
  async createDish(@Arg('data') data: DishCreateInput, @UserId() userId: string): Promise<Dish> {
    return this.service.create(data, userId);
  }

  @Authorized('dish:update')
  @Mutation(() => Dish)
  async updateDish(
    @Args() { data, where }: DishUpdateArgs,
    @UserId() userId: string
  ): Promise<Dish> {
    return this.service.update(data, where, userId);
  }

  @Authorized('dish:create')
  @Mutation(() => [Dish])
  async createManyDishs(
    @Args() { data }: DishCreateManyArgs,
    @UserId() userId: string
  ): Promise<Dish[]> {
    return this.service.createMany(data, userId);
  }

  @Authorized('dish:delete')
  @Mutation(() => StandardDeleteResponse)
  async deleteDish(
    @Arg('where') where: DishWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }

  @Mutation(() => [Dish])
  async successfulTransaction(
    @Arg('data') data: DishCreateInput,
    @Ctx() ctx: BaseContext
  ): Promise<Dish[]> {
    return this.service.successfulTransaction(data, ctx.user.id);
  }

  @Mutation(() => [Dish])
  async failedTransaction(
    @Arg('data') data: DishCreateInput,
    @Ctx() ctx: BaseContext
  ): Promise<Dish[]> {
    return this.service.failedTransaction(data, ctx.user.id);
  }
}
