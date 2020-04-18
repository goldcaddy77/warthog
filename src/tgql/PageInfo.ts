import { Field, ObjectType } from 'type-graphql';

export interface ConnectionEdge<E> {
  node: E;
  cursor: string;
}

export interface ConnectionResult<E> {
  totalCount: number;
  edges: ConnectionEdge<E>[];
  pageInfo: PageInfo;
}

@ObjectType()
export class PageInfo {
  @Field({ nullable: false })
  hasNextPage!: boolean;

  @Field({ nullable: false })
  hasPreviousPage!: boolean;

  @Field({ nullable: false })
  startCursor!: string;

  @Field({ nullable: false })
  endCursor!: string;
}
