import { BaseModel, Model, OneToMany, StringField } from '@warthog/core';

// import { FeatureFlagUser, UserSegment } from '../models';
import { FeatureFlagUser } from '../feature-flag-user/feature-flag-user.model';
import { UserSegment } from '../user-segment/user-segment.model';

@Model()
export class User extends BaseModel {
  @StringField({ maxLength: 20, minLength: 3, nullable: false, unique: true })
  key: string;

  @OneToMany(
    () => FeatureFlagUser,
    (featureFlagUser: FeatureFlagUser) => featureFlagUser.user
  )
  featureFlagUsers?: FeatureFlagUser[];

  @OneToMany(
    () => UserSegment,
    (userSegments: UserSegment) => userSegments.user
  )
  userSegments?: UserSegment[];
}
