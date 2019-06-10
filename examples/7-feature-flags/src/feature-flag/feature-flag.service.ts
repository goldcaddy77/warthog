import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseService } from '../../../../src';

import { FeatureFlag } from './feature-flag.model';

@Service('FeatureFlagService')
export class FeatureFlagService extends BaseService<FeatureFlag> {
  constructor(
    @InjectRepository(FeatureFlag) protected readonly repository: Repository<FeatureFlag>
  ) {
    super(FeatureFlag, repository);
  }
}
