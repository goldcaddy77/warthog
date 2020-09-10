import { Service } from 'typedi';
import { Column, Entity, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseModel, BaseService } from '../../';

@Entity()
export class MyBase extends BaseModel {
  @Column()
  firstName!: string;

  @Column()
  lastName!: string;
}

@Service('MyBaseService')
export class MyBaseService extends BaseService<MyBase> {
  constructor(@InjectRepository(MyBase) protected readonly repository: Repository<MyBase>) {
    super(MyBase, repository);
  }
}
