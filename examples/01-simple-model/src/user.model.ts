import {
  BaseModel,
  BooleanField,
  EmailField,
  // EnumField,
  FloatField,
  IntField,
  Model,
  StringField
} from '../../../src';

// Note: this must be exported and in the same file where it's attached with @EnumField
// Also - must use string enums
// export enum StringEnum {
//   FOO = 'FOO',
//   BAR = 'BAR'
// }

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

  @BooleanField()
  isRequired?: boolean;

  // @EnumField('StringEnum', StringEnum)
  // stringEnumField: StringEnum;

  @FloatField()
  rating?: number;

  @StringField()
  magicId?: string;

  @StringField({ filters: 'string' })
  bypassMagicId?: string;
}
