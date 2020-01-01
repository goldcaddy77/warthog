import { Arg, Mutation, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseModel, BaseService, Model, StringField } from '../../';

import { CreateIDTestCreateInput } from './create-id-model/generated';

@Model()
export class CreateIDTest extends BaseModel {
  @StringField()
  stringField?: string;
}

@Service('CreateIDTestService')
export class CreateIDTestService extends BaseService<CreateIDTest> {
  constructor(
    @InjectRepository(CreateIDTest) protected readonly repository: Repository<CreateIDTest>
  ) {
    super(CreateIDTest, repository);
  }
}
@Resolver(CreateIDTest)
export class CreateIDTestResolver {
  constructor(@Inject('CreateIDTestService') public readonly service: CreateIDTestService) {}

  @Mutation(() => CreateIDTest)
  async createKitchenSink(@Arg('data') data: CreateIDTestCreateInput): Promise<CreateIDTest> {
    return this.service.create(data, '1');
  }
}
