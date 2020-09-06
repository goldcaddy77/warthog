import { generateId, IDType, Model, PrimaryIdField, StringField } from '../../../src';
import { BeforeInsert } from 'typeorm';

@Model()
export class User {
  @PrimaryIdField({ filter: ['in'] })
  id!: IDType;

  @BeforeInsert()
  setId() {
    this.id = this.id || generateId();
  }

  @StringField({ maxLength: 30, sort: true, filter: ['eq', 'contains'] })
  firstName?: string;

  @StringField({ maxLength: 30, nullable: true })
  updatedById?: string;

  @StringField({ maxLength: 50, minLength: 2 })
  lastName?: string;
}
