import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseModel, BaseService, Model } from '../..';
import { GeoPoint } from '../../decorators';
import { LatLng } from '../../tgql';

@Model()
export class PostgisModelTest extends BaseModel {
  @GeoPoint({ dataType: 'geometry', nullable: true })
  geometryPoint?: LatLng;

  @GeoPoint({ nullable: true }) // Defaults to 'geography'
  geographyPoint?: LatLng;
}

@Service('PostgisModelTestService')
export class PostgisModelTestService extends BaseService<PostgisModelTest> {
  constructor(
    @InjectRepository(PostgisModelTest) protected readonly repository: Repository<PostgisModelTest>
  ) {
    super(PostgisModelTest, repository);
  }
}
