import { Field, InterfaceType, ObjectType } from 'type-graphql';

import { ID } from '../core';

// tslint:disable:max-classes-per-file

@InterfaceType()
export abstract class DeleteResponse {
  @Field(type => String)
  id!: ID;
}

@ObjectType()
export class StandardDeleteResponse {
  @Field(type => String)
  id!: ID;
}

// tslint:enable:max-classes-per-file
