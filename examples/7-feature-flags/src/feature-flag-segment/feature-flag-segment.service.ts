import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseService } from '../../../../src';

import { FeatureFlagSegment } from './feature-flag-segment.model';

@Service('FeatureFlagSegmentService')
export class FeatureFlagSegmentService extends BaseService<FeatureFlagSegment> {
  constructor(
    @InjectRepository(FeatureFlagSegment)
    protected readonly repository: Repository<FeatureFlagSegment>
  ) {
    super(FeatureFlagSegment, repository);
  }
}
