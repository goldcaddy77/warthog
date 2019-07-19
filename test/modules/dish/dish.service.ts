import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseService } from '../../../src';
import { Dish } from './dish.model';

@Service('DishService')
export class DishService extends BaseService<Dish> {
  constructor(@InjectRepository(Dish) protected readonly repository: Repository<Dish>) {
    super(Dish, repository);
  }
}
