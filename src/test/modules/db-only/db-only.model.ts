import { IDType, Model, StringField } from '../../..';

import { PrimaryGeneratedColumn } from 'typeorm';

// V3: TODO: dbOnly models should not emit a GraphQL type in the schema
@Model({ dbOnly: true })
export class DbOnly {
  @PrimaryGeneratedColumn()
  id!: IDType;

  @StringField()
  stringField?: string;
}
