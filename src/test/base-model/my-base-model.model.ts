import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseModel, BaseService, Model, StringField } from '../..';

@Model()
export class MyBaseModelTest extends BaseModel {
  @StringField()
  stringField!: string;
}

@Service('MyBaseModelTestService')
export class MyBaseModelTestService extends BaseService<MyBaseModelTest> {
  constructor(
    @InjectRepository(MyBaseModelTest) protected readonly repository: Repository<MyBaseModelTest>
  ) {
    super(MyBaseModelTest, repository);
  }
}
