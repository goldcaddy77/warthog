import { BaseModel, Model, StringField } from '../../../../src';

@Model()
export class FeatureFlagUser extends BaseModel {
  //
  //
  // Users are always scoped within a project and environment.
  // In other words, each environment has its own set of user records.
  //
  //
  @StringField({ maxLength: 30 })
  firstName?: string;

  @StringField({ maxLength: 50, minLength: 2 })
  lastName?: string;
}
