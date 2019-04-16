import { Authorized } from 'type-graphql';
import { Unique } from 'typeorm';
import {
  BaseModel,
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
@Unique(['firstName', 'stringEnumField'])
export class User extends BaseModelUUID {
  @StringField({ maxLength: 30 })
  firstName?: string;

  @StringField({ maxLength: 50, minLength: 2 })
  lastName?: string;

  @EnumField('StringEnum', StringEnum)
  stringEnumField?: StringEnum;

  @EmailField()
  email?: string;

  @StringField({ maxLength: 30, nullable: true })
  nickName?: string;

  @Authorized('user:admin')
  @StringField({ nullable: true })
  privateField?: string;

  @JSONField({ nullable: true })
  jsonField?: JSON;
}
