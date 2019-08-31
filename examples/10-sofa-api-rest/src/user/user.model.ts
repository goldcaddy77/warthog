import { BaseModel, Model, StringField } from '../../../../src';

@Model()
export class User extends BaseModel {
  @StringField({ maxLength: 20, minLength: 3, nullable: false, unique: true })
  key: string;
}
