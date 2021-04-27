import {
  CreatedAtField,
  DateTimeString,
  IdModel,
  IDType,
  Model,
  PrimaryIdField,
  StringField
} from '../../../../../src';

@Model()
export class User extends IdModel {
  @PrimaryIdField({ filter: ['in'] })
  id!: IDType;

  @StringField()
  firstName?: string;

  @CreatedAtField()
  createdAt!: DateTimeString;
}
