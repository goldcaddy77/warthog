import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseService } from '../../../src';

import { KitchenSink } from './kitchen-sink.model';

@Service('KitchenSinkService')
export class KitchenSinkService extends BaseService<KitchenSink> {
  constructor(
    @InjectRepository(KitchenSink) protected readonly repository: Repository<KitchenSink>
  ) {
    super(KitchenSink, repository);
  }
}
