import { BaseModel, EmailField, IntField, Model, StringField } from '../../../src';

@Model()
export class User extends BaseModel {
  @StringField()
  firstName?: string;

  @StringField({ nullable: true })
  lastName?: string;

  @EmailField()
  email?: string;

  @IntField()
  age?: number;
}
