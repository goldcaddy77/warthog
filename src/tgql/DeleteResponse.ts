import { Field, ID, InterfaceType, ObjectType } from 'type-graphql';

import { IDType } from '../core';

// tslint:disable:max-classes-per-file

@InterfaceType()
export abstract class DeleteResponse {
  @Field(type => ID)
  id!: IDType;
}

@ObjectType()
export class StandardDeleteResponse {
  @Field(type => ID)
  id!: IDType;
}

// tslint:enable:max-classes-per-file
