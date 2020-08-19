import { BaseModel, Model, StringField } from '@warthog/core';

@Model()
export class User extends BaseModel {
  @StringField({ maxLength: 30 })
  firstName?: string;

  @StringField({ maxLength: 50, minLength: 2 })
  lastName?: string;
}
