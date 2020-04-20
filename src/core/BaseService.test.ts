import { Container, Service } from 'typedi';
import { Repository, Entity } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseModel, BaseService, createDBConnection, StringField } from '../';

@Entity()
export class Foo extends BaseModel {
  @StringField()
  name?: string;
}

@Service()
export class FooService extends BaseService<Foo> {
  constructor(@InjectRepository(Foo) protected readonly repository: Repository<Foo>) {
    super(Foo, repository);
  }
}

describe('Config', () => {
  let service: FooService;
  let foo: Foo;
  beforeAll(async () => {
    await createDBConnection();

    service = Container.get(FooService) as FooService;
  });

  beforeEach(() => {
    foo = service.manager.create<Foo>(Foo, {
      name: 'Dan'
    });

    console.log('foo', foo);
  });

  test('Does some shiz', async () => {
    console.log('service 2', service);
  });
});
