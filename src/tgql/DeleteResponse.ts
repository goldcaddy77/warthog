import { Field, ID, InterfaceType, ObjectType } from 'type-graphql';

import { IDType } from '../core';

@InterfaceType()
export abstract class DeleteResponse {
  @Field(() => ID)
  id!: IDType;
}

@ObjectType()
export class StandardDeleteResponse {
  @Field(() => ID)
  id!: IDType;
}
