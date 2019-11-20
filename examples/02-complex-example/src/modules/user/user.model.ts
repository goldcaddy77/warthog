import { Authorized } from 'type-graphql';
import { Unique, Column } from 'typeorm';
import {
  BaseModel,
  DateField,
  EmailField,
  EnumField,
  IdField,
  JSONField,
  Model,
  StringField,
  JsonObject
} from '../../../../../src';

// Note: this must be exported and in the same file where it's attached with @EnumField
// Also - must use string enums
export enum StringEnum {
  FOO = 'FOO',
  BAR = 'BAR'
}

@Model()
@Unique(['firstName', 'stringEnumField'])
export class User extends BaseModel {
  @StringField({ maxLength: 30 })
  firstName: string;

  @StringField({ maxLength: 50, minLength: 2 })
  lastName: string;

  @EnumField('StringEnum', StringEnum)
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
  jsonField?: JsonObject;

  @IdField({ nullable: true })
  idField: string;

  @Column({ nullable: true })
  dbOnlyColumn?: string;

  @StringField({ filter: false, nullable: true })
  noFilterField?: string;

  @StringField({ sort: false, nullable: true })
  noSortField?: string;

  @StringField({ filter: false, sort: false, nullable: true })
  noFilterOrSortField?: string;
}
