import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseService } from '../../../../src';

import { UserSegment } from './user-segment.model';

@Service('UserSegmentService')
export class UserSegmentService extends BaseService<UserSegment> {
  constructor(
    @InjectRepository(UserSegment) protected readonly repository: Repository<UserSegment>
  ) {
    super(UserSegment, repository);
  }
}
