// This file has been auto-generated by Warthog.  Do not update directly as it
// will be re-written.  If you need to change this file, update models or add
// new TypeGraphQL objects
import {
  ArgsType,
  Field as TypeGraphQLField,
  Float,
  ID,
  InputType as TypeGraphQLInputType,
  Int
} from "type-graphql";
import { registerEnumType } from "type-graphql";

// tslint:disable-next-line:no-var-requires
const { GraphQLJSONObject } = require("graphql-type-json");

import { BaseWhereInput, PaginationArgs } from "../../../src";
import { User } from "../src/user.model";
import { Post } from "../src/post.model";

export enum UserOrderByEnum {
  createdAt_ASC = "createdAt_ASC",
  createdAt_DESC = "createdAt_DESC",

  updatedAt_ASC = "updatedAt_ASC",
  updatedAt_DESC = "updatedAt_DESC",

  deletedAt_ASC = "deletedAt_ASC",
  deletedAt_DESC = "deletedAt_DESC",

  firstName_ASC = "firstName_ASC",
  firstName_DESC = "firstName_DESC"
}

registerEnumType(UserOrderByEnum, {
  name: "UserOrderByInput"
});

@TypeGraphQLInputType()
export class UserWhereInput extends BaseWhereInput {
  @TypeGraphQLField({ nullable: true })
  firstName_eq?: string;

  @TypeGraphQLField({ nullable: true })
  firstName_contains?: string;

  @TypeGraphQLField({ nullable: true })
  firstName_startsWith?: string;

  @TypeGraphQLField({ nullable: true })
  firstName_endsWith?: string;

  @TypeGraphQLField(type => [String], { nullable: true })
  firstName_in?: string[];
}

@TypeGraphQLInputType()
export class UserWhereUniqueInput {
  @TypeGraphQLField(type => String)
  id?: string;
}

@TypeGraphQLInputType()
export class UserCreateInput {
  @TypeGraphQLField()
  firstName!: string;
}

@TypeGraphQLInputType()
export class UserUpdateInput {
  @TypeGraphQLField({ nullable: true })
  firstName?: string;
}

@ArgsType()
export class UserWhereArgs extends PaginationArgs {
  @TypeGraphQLField(type => UserWhereInput, { nullable: true })
  where?: UserWhereInput;

  @TypeGraphQLField(type => UserOrderByEnum, { nullable: true })
  orderBy?: UserOrderByEnum;
}

@ArgsType()
export class UserCreateManyArgs {
  @TypeGraphQLField(type => [UserCreateInput])
  data!: UserCreateInput[];
}

@ArgsType()
export class UserUpdateArgs {
  @TypeGraphQLField() data!: UserUpdateInput;
  @TypeGraphQLField() where!: UserWhereUniqueInput;
}

export enum PostOrderByEnum {
  createdAt_ASC = "createdAt_ASC",
  createdAt_DESC = "createdAt_DESC",

  updatedAt_ASC = "updatedAt_ASC",
  updatedAt_DESC = "updatedAt_DESC",

  deletedAt_ASC = "deletedAt_ASC",
  deletedAt_DESC = "deletedAt_DESC",

  title_ASC = "title_ASC",
  title_DESC = "title_DESC",

  userId_ASC = "userId_ASC",
  userId_DESC = "userId_DESC"
}

registerEnumType(PostOrderByEnum, {
  name: "PostOrderByInput"
});

@TypeGraphQLInputType()
export class PostWhereInput extends BaseWhereInput {
  @TypeGraphQLField({ nullable: true })
  title_eq?: string;

  @TypeGraphQLField({ nullable: true })
  title_contains?: string;

  @TypeGraphQLField({ nullable: true })
  title_startsWith?: string;

  @TypeGraphQLField({ nullable: true })
  title_endsWith?: string;

  @TypeGraphQLField(type => [String], { nullable: true })
  title_in?: string[];

  @TypeGraphQLField(type => ID, { nullable: true })
  userId_eq?: string;

  @TypeGraphQLField(type => [ID], { nullable: true })
  userId_in?: string[];
}

@TypeGraphQLInputType()
export class PostWhereUniqueInput {
  @TypeGraphQLField(type => String)
  id?: string;
}

@TypeGraphQLInputType()
export class PostCreateInput {
  @TypeGraphQLField()
  title!: string;

  @TypeGraphQLField()
  userId!: string;
}

@TypeGraphQLInputType()
export class PostUpdateInput {
  @TypeGraphQLField({ nullable: true })
  title?: string;

  @TypeGraphQLField({ nullable: true })
  userId?: string;
}

@ArgsType()
export class PostWhereArgs extends PaginationArgs {
  @TypeGraphQLField(type => PostWhereInput, { nullable: true })
  where?: PostWhereInput;

  @TypeGraphQLField(type => PostOrderByEnum, { nullable: true })
  orderBy?: PostOrderByEnum;
}

@ArgsType()
export class PostCreateManyArgs {
  @TypeGraphQLField(type => [PostCreateInput])
  data!: PostCreateInput[];
}

@ArgsType()
export class PostUpdateArgs {
  @TypeGraphQLField() data!: PostUpdateInput;
  @TypeGraphQLField() where!: PostWhereUniqueInput;
}
