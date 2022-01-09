import { Field } from 'type-graphql';
import { Column } from 'typeorm';
import { BaseModel, Model, WarthogField } from '../../../src';
import File from './file.scalar';

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

@Model()
export class User extends BaseModel {
  @WarthogField('string')
  @Field(() => File)
  @Column()
  file: string;
}
