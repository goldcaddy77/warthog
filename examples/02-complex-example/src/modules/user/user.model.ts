import { Authorized } from 'type-graphql';
import { Unique, Column } from 'typeorm';
import {
  BaseModel,
  DateField,
  EmailField,
  EnumField,
  JSONField,
  Model,
  StringField
} from '../../../../../src';

// Note: this must be exported and in the same file where it's attached with @EnumField
// Also - must use string enums
export enum StringEnum {
  FOO = 'FOO',
  BAR = 'BAR'
}

@Model()
// @Unique(['firstName', 'stringEnumField'])
export class User extends BaseModel {
  @StringField({ maxLength: 30 })
  firstName: string;

  @StringField({ maxLength: 50, minLength: 2 })
  lastName: string;

  // @EnumField('StringEnum', StringEnum)
  @StringField()
  stringEnumField: StringEnum;

  @EmailField()
  email: string;

  @DateField()
  registeredAt: Date;

  @StringField({ maxLength: 30, nullable: true })
  nickName?: string;

  @Authorized('user:admin')
  @StringField({ nullable: true })
  privateField?: string;

  @JSONField({ nullable: true })
  jsonField?: JSON;

  // @Column('bytea')
  // serialized?: Buffer;
}
