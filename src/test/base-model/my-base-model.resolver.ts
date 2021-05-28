import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { MyBaseModelTestCreateInput, MyBaseModelTestWhereArgs } from './generated';
import { MyBaseModelTest, MyBaseModelTestService } from './my-base-model.model';

@Resolver(MyBaseModelTest)
export class MyBaseModelTestResolver {
  constructor(@Inject('MyBaseModelTestService') public readonly service: MyBaseModelTestService) {}

  @Query(() => [MyBaseModelTest])
  async myBaseModels(
    @Args() { where, orderBy, limit, offset }: MyBaseModelTestWhereArgs
  ): Promise<MyBaseModelTest[]> {
    return this.service.find(where, orderBy, limit, offset);
  }

  @Mutation(() => MyBaseModelTest)
  async createMyBaseModels(
    @Arg('data') data: MyBaseModelTestCreateInput
  ): Promise<MyBaseModelTest> {
    return this.service.create(data, '1');
  }
}
