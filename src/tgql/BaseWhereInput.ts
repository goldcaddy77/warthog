import { Field, InputType } from 'type-graphql';

@InputType()
export class BaseWhereInput {
  @Field(type => String, { nullable: true })
  id_eq?: string;
  @Field(type => [String], { nullable: true })
  id_in?: string[];

  @Field({ nullable: true })
  createdAt_eq?: string;
  @Field({ nullable: true })
  createdAt_lt?: string;
  @Field({ nullable: true })
  createdAt_lte?: string;
  @Field({ nullable: true })
  createdAt_gt?: string;
  @Field({ nullable: true })
  createdAt_gte?: string;
  @Field({ nullable: true })
  createdById_eq?: string;

  @Field({ nullable: true })
  updatedAt_eq?: string;
  @Field({ nullable: true })
  updatedAt_lt?: string;
  @Field({ nullable: true })
  updatedAt_lte?: string;
  @Field({ nullable: true })
  updatedAt_gt?: string;
  @Field({ nullable: true })
  updatedAt_gte?: string;
  @Field({ nullable: true })
  updatedById_eq?: string;

  @Field({ nullable: true })
  deletedAt_all?: boolean; // This turns off the default soft-deleted logic
  @Field({ nullable: true })
  deletedAt_eq?: string;
  @Field({ nullable: true })
  deletedAt_lt?: string;
  @Field({ nullable: true })
  deletedAt_lte?: string;
  @Field({ nullable: true })
  deletedAt_gt?: string;
  @Field({ nullable: true })
  deletedAt_gte?: string;
  @Field({ nullable: true })
  deletedById_eq?: string;
}
