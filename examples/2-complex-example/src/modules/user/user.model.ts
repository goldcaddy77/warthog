import { Authorized } from 'type-graphql';

import { BaseModel, EmailField, EnumField, Model, StringField } from '../../../../../src';

// Note: this must be exported and in the same file where it's attached with @EnumField
// Also - must use string enums
export enum StringEnum {
  FOO = 'FOO',
  BAR = 'BAR'
}

@Model()
export class User extends BaseModel {
  @StringField({ maxLength: 30 })
  firstName?: string;

  @StringField({ maxLength: 50, minLength: 2 })
  lastName?: string;

  @EnumField('StringEnum', StringEnum, { nullable: true })
  stringEnumField?: StringEnum;

  @EmailField()
  email?: string;

  @StringField({ maxLength: 30, nullable: true })
  nickName?: string;

  @Authorized('user:admin')
  @StringField({ nullable: true })
  privateField?: string;
}
