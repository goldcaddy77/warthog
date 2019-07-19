import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';

import { BaseContext, Fields, StandardDeleteResponse, UserId } from '../../../src';
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

  @FieldResolver(() => KitchenSink)
  user(@Root() dish: Dish, @Ctx() ctx: BaseContext): Promise<KitchenSink> {
    return ctx.dataLoader.loaders.Dish.user.load(dish);
  }

  @Query(() => [Dish])
  async posts(
    @Args() { where, orderBy, limit, offset }: DishWhereArgs,
    @Fields() fields: string[]
  ): Promise<Dish[]> {
    return this.service.find<DishWhereInput>(where, orderBy, limit, offset, fields);
  }

  @Query(() => Dish)
  async dish(@Arg('where') where: DishWhereUniqueInput): Promise<Dish> {
    return this.service.findOne<DishWhereUniqueInput>(where);
  }

  @Mutation(() => Dish)
  async createDish(@Arg('data') data: DishCreateInput, @UserId() userId: string): Promise<Dish> {
    return this.service.create(data, userId);
  }

  @Mutation(() => Dish)
  async updateDish(
    @Args() { data, where }: DishUpdateArgs,
    @UserId() userId: string
  ): Promise<Dish> {
    return this.service.update(data, where, userId);
  }

  @Mutation(() => [Dish])
  async createManyDishs(
    @Args() { data }: DishCreateManyArgs,
    @UserId() userId: string
  ): Promise<Dish[]> {
    return this.service.createMany(data, userId);
  }

  @Mutation(() => StandardDeleteResponse)
  async deleteDish(
    @Arg('where') where: DishWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}
