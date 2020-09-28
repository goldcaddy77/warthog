import { BaseModel, Model, OneToMany, StringField } from 'warthog';

import { Environment } from '../environment/environment.model';
import { FeatureFlagSegment } from '../feature-flag-segment/feature-flag-segment.model';
import { FeatureFlagUser } from '../feature-flag-user/feature-flag-user.model';
import { FeatureFlag } from '../feature-flag/feature-flag.model';
import { Segment } from '../segment/segment.model';
import { UserSegment } from '../user-segment/user-segment.model';

@Model()
export class Project extends BaseModel {
  @StringField({ maxLength: 50, minLength: 3, nullable: false })
  name: string;

  @StringField({ maxLength: 20, minLength: 3, nullable: false, unique: true })
  key: string;

  @OneToMany(
    () => Environment,
    (environment: Environment) => environment.project
  )
  environments?: Environment[];

  @OneToMany(
    () => Segment,
    (segment: Segment) => segment.project
  )
  segments?: Segment[];

  @OneToMany(
    () => FeatureFlag,
    (featureFlag: FeatureFlag) => featureFlag.project
  )
  featureFlags?: FeatureFlag[];

  @OneToMany(
    () => FeatureFlagUser,
    (featureFlagUser: FeatureFlagUser) => featureFlagUser.project
  )
  featureFlagUsers?: FeatureFlagUser[];

  @OneToMany(
    () => FeatureFlagSegment,
    (featureFlagSegment: FeatureFlagSegment) => featureFlagSegment.project
  )
  featureFlagSegments?: FeatureFlagSegment[];

  @OneToMany(
    () => UserSegment,
    (userSegment: UserSegment) => userSegment.project
  )
  userSegments?: UserSegment[];
}
