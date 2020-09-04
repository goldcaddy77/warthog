import { IDType, Model, StringField } from '../../../src';

import * as shortid from 'shortid';
import { Field, ID } from 'type-graphql';
import { BeforeInsert, PrimaryColumn } from 'typeorm';

@Model()
export class User {
  @Field(() => ID)
  @PrimaryColumn({ type: String })
  id!: IDType;

  getId() {
    // If settings allow ID to be specified on create, use the specified ID
    return this.id || shortid.generate();
  }

  @BeforeInsert()
  setId() {
    this.id = this.getId();
  }

  @StringField({ maxLength: 30 })
  firstName?: string;

  @StringField({ maxLength: 30, nullable: true })
  updatedById?: string;

  @StringField({ maxLength: 50, minLength: 2 })
  lastName?: string;
}
