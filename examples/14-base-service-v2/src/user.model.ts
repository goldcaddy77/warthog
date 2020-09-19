import { IdModel, IDType, Model, PrimaryIdField, StringField } from '../../../src';

@Model()
export class User extends IdModel {
  @PrimaryIdField({ filter: ['in'] })
  id!: IDType;

  @StringField({ maxLength: 30, sort: true, filter: ['eq', 'contains'] })
  firstName?: string;

  @StringField({ maxLength: 30, nullable: true })
  updatedById?: string;

  @StringField({ maxLength: 50, minLength: 2 })
  lastName?: string;
}
