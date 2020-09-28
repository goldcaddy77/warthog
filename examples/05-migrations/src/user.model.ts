import { BaseModel, EmailField, Model, StringField } from 'warthog';

@Model()
export class User extends BaseModel {
  @StringField()
  firstName?: string;

  @StringField({ nullable: true })
  lastName?: string;

  @EmailField()
  email?: string;
}
