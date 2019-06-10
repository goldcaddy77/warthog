import { BaseModel, Model, OneToMany, StringField } from '../../../../src';

import { FeatureFlagUser } from '../feature-flag-user/feature-flag-user.model';

@Model()
export class User extends BaseModel {
  @StringField({ maxLength: 20, minLength: 3, nullable: false, unique: true })
  key: string;

  @OneToMany(() => FeatureFlagUser, (featureFlagUser: FeatureFlagUser) => featureFlagUser.user)
  featureFlagUsers?: FeatureFlagUser[];
}
