import { BaseModel, EmailField, Model, StringField } from '@warthog/core';

@Model()
export class User extends BaseModel {
  @StringField()
  firstName?: string;

  @StringField({ nullable: true })
  lastName?: string;

  @EmailField()
  email?: string;
}
