import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
  @Field({ nullable: false })
  hasNextPage!: boolean;

  @Field({ nullable: false })
  hasPreviousPage!: boolean;

  @Field({ nullable: true })
  startCursor?: string;

  @Field({ nullable: true })
  endCursor?: string;
}
