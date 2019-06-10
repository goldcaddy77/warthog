import { BaseModel, Model, StringField } from '../../../../src';

@Model()
export class UserSegment extends BaseModel {
  // userId
  // segmentId
  // environment
  // project

  @StringField({ maxLength: 30 })
  firstName?: string;

  @StringField({ maxLength: 50, minLength: 2 })
  lastName?: string;
}
