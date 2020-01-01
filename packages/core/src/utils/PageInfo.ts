import { Field, ObjectType } from 'type-graphql';

export interface ConnectionEdge<E> {
  node: E;
  cursor: string;
}

export interface ConnectionResult<E> {
  nodes: E[]; // list of records returned from the database
  edges?: ConnectionEdge<E>[];
  pageInfo: PageInfo;
}

@ObjectType()
export class PageInfo {
  @Field(() => Number, { nullable: false })
  limit!: number;

  @Field(() => Number, { nullable: false })
  offset!: number;

  @Field(() => Number, { nullable: false })
  totalCount!: number;

  @Field({ nullable: false })
  hasNextPage!: boolean;

  @Field({ nullable: false })
  hasPreviousPage!: boolean;
}
