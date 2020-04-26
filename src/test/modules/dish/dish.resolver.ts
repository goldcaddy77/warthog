import {
  Arg,
  Args,
  ArgsType,
  Authorized,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  ObjectType,
  Field
} from 'type-graphql';
import { Inject } from 'typedi';
import { Min } from 'class-validator';

import {
  BaseContext,
  Fields,
  RawFields,
  PageInfo,
  StandardDeleteResponse,
  UserId
} from '../../../';

import {
  DishCreateInput,
  DishCreateManyArgs,
  DishOrderByEnum,
  DishUpdateArgs,
  DishWhereArgs,
  DishWhereInput,
  DishWhereUniqueInput
} from '../../generated';

import { KitchenSink } from '../kitchen-sink/kitchen-sink.model';

import { Dish } from './dish.model';
import { DishService } from './dish.service';

@ObjectType()
export class DishEdge {
  @Field(() => Dish, { nullable: false })
  node!: Dish;

  @Field(() => String, { nullable: false })
  cursor!: string;
}

@ObjectType()
export class DishConnection {
  @Field(() => Int, { nullable: false })
  totalCount!: number;

  @Field(() => [DishEdge], { nullable: false })
  edges!: DishEdge[];

  @Field(() => PageInfo, { nullable: false })
  pageInfo!: PageInfo;
}

@ArgsType()
export class ConnectionPageInputOptions {
  @Field(() => Int, { nullable: true })
  @Min(0)
  first?: number;

  @Field(() => String, { nullable: true })
  after?: string; // TODO: should we make a RelayCursor scalar?

  @Field(() => Int, { nullable: true })
  @Min(0)
  last?: number;

  @Field(() => String, { nullable: true })
  before?: string;
}

@ArgsType()
export class DishConnectionWhereArgs extends ConnectionPageInputOptions {
  @Field(() => DishWhereInput, { nullable: true })
  where?: DishWhereInput;

  @Field(() => DishOrderByEnum, { nullable: true })
  orderBy?: DishOrderByEnum;
}

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
  @Query(() => DishConnection)
  async dishConnection(
    @Args() { where, orderBy, ...pageOptions }: DishConnectionWhereArgs,
    @RawFields() fields: object
  ): Promise<DishConnection> {
    return this.service.findConnection<DishWhereInput>(where, orderBy, pageOptions, fields);
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
