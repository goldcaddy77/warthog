import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseService } from '../../../../src';

import { Segment } from './segment.model';

@Service('SegmentService')
export class SegmentService extends BaseService<Segment> {
  constructor(@InjectRepository(Segment) protected readonly repository: Repository<Segment>) {
    super(Segment, repository);
  }
}
