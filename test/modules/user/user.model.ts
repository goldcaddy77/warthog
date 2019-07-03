import { BaseModel, Model, StringField } from '../../../src';

@Model()
export class User extends BaseModel {
  @StringField()
  key?: string;
}
