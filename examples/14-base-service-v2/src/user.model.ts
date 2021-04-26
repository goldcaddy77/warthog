import { BaseModel, EnumField, Model, StringField } from '../../../src';

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

@Model()
export class User extends BaseModel {
  @StringField({ maxLength: 30, sort: true, filter: ['eq', 'contains'] })
  firstName?: string;

  @StringField({ maxLength: 50, minLength: 2 })
  lastName?: string;

  @EnumField('Status', Status)
  status: Status;
}
