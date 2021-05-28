// This file has been auto-generated by Warthog.  Do not update directly as it
// will be re-written.  If you need to change this file, update models or add
// new TypeGraphQL objects
// prettier-ignore
// @ts-ignore
import { DateResolver as Date } from 'graphql-scalars';
// prettier-ignore
// @ts-ignore
import { GraphQLID as ID } from 'graphql';
// prettier-ignore
// @ts-ignore
import { ArgsType, Field as TypeGraphQLField, Float, InputType as TypeGraphQLInputType, Int } from 'type-graphql';
// prettier-ignore
// @ts-ignore
import { registerEnumType, GraphQLISODateTime as DateTime } from "type-graphql";

// prettier-ignore
// @ts-ignore eslint-disable-next-line @typescript-eslint/no-var-requires
const { GraphQLJSONObject } = require('graphql-type-json');
// prettier-ignore
// @ts-ignore

import { BaseWhereInput, JsonObject, PaginationArgs, DateOnlyString, DateTimeString, IDType } from '../../../src';

// @ts-ignore

import { User } from "../src/user.model";

export enum UserOrderByEnum {
  firstName_ASC = "firstName_ASC",
  firstName_DESC = "firstName_DESC",

  lastName_ASC = "lastName_ASC",
  lastName_DESC = "lastName_DESC",

  createdAt_ASC = "createdAt_ASC",
  createdAt_DESC = "createdAt_DESC",

  createdById_ASC = "createdById_ASC",
  createdById_DESC = "createdById_DESC",

  updatedAt_ASC = "updatedAt_ASC",
  updatedAt_DESC = "updatedAt_DESC",

  updatedById_ASC = "updatedById_ASC",
  updatedById_DESC = "updatedById_DESC",

  deletedAt_ASC = "deletedAt_ASC",
  deletedAt_DESC = "deletedAt_DESC",

  deletedById_ASC = "deletedById_ASC",
  deletedById_DESC = "deletedById_DESC",

  version_ASC = "version_ASC",
  version_DESC = "version_DESC",

  ownerId_ASC = "ownerId_ASC",
  ownerId_DESC = "ownerId_DESC",

  id_ASC = "id_ASC",
  id_DESC = "id_DESC"
}

registerEnumType(UserOrderByEnum, {
  name: "UserOrderByInput"
});

@TypeGraphQLInputType()
export class UserWhereInput {
  @TypeGraphQLField({ nullable: true })
  firstName_eq?: string;

  @TypeGraphQLField({ nullable: true })
  firstName_contains?: string;

  @TypeGraphQLField({ nullable: true })
  firstName_startsWith?: string;

  @TypeGraphQLField({ nullable: true })
  firstName_endsWith?: string;

  @TypeGraphQLField(() => [String], { nullable: true })
  firstName_in?: string[];

  @TypeGraphQLField({ nullable: true })
  lastName_eq?: string;

  @TypeGraphQLField({ nullable: true })
  lastName_contains?: string;

  @TypeGraphQLField({ nullable: true })
  lastName_startsWith?: string;

  @TypeGraphQLField({ nullable: true })
  lastName_endsWith?: string;

  @TypeGraphQLField(() => [String], { nullable: true })
  lastName_in?: string[];

  @TypeGraphQLField(() => DateTime, { nullable: true })
  createdAt_eq?: DateTimeString;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  createdAt_lt?: DateTimeString;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  createdAt_lte?: DateTimeString;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  createdAt_gt?: DateTimeString;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  createdAt_gte?: DateTimeString;

  @TypeGraphQLField(() => ID, { nullable: true })
  createdById_eq?: string;

  @TypeGraphQLField(() => [ID], { nullable: true })
  createdById_in?: string[];

  @TypeGraphQLField(() => DateTime, { nullable: true })
  updatedAt_eq?: DateTimeString;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  updatedAt_lt?: DateTimeString;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  updatedAt_lte?: DateTimeString;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  updatedAt_gt?: DateTimeString;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  updatedAt_gte?: DateTimeString;

  @TypeGraphQLField(() => ID, { nullable: true })
  updatedById_eq?: string;

  @TypeGraphQLField(() => [ID], { nullable: true })
  updatedById_in?: string[];

  @TypeGraphQLField({ nullable: true })
  deletedAt_all?: Boolean;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  deletedAt_eq?: DateTimeString;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  deletedAt_lt?: DateTimeString;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  deletedAt_lte?: DateTimeString;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  deletedAt_gt?: DateTimeString;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  deletedAt_gte?: DateTimeString;

  @TypeGraphQLField(() => ID, { nullable: true })
  deletedById_eq?: string;

  @TypeGraphQLField(() => [ID], { nullable: true })
  deletedById_in?: string[];

  @TypeGraphQLField(() => Int, { nullable: true })
  version_eq?: number;

  @TypeGraphQLField(() => Int, { nullable: true })
  version_gt?: number;

  @TypeGraphQLField(() => Int, { nullable: true })
  version_gte?: number;

  @TypeGraphQLField(() => Int, { nullable: true })
  version_lt?: number;

  @TypeGraphQLField(() => Int, { nullable: true })
  version_lte?: number;

  @TypeGraphQLField(() => [Int], { nullable: true })
  version_in?: number[];

  @TypeGraphQLField(() => ID, { nullable: true })
  ownerId_eq?: string;

  @TypeGraphQLField(() => [ID], { nullable: true })
  ownerId_in?: string[];

  @TypeGraphQLField(() => [ID], { nullable: true })
  id_in?: string[];
}

@TypeGraphQLInputType()
export class UserWhereUniqueInput {
  @TypeGraphQLField(() => ID)
  id?: string;
}

@TypeGraphQLInputType()
export class UserCreateInput {
  @TypeGraphQLField()
  firstName!: string;

  @TypeGraphQLField()
  lastName!: string;
}

@TypeGraphQLInputType()
export class UserUpdateInput {
  @TypeGraphQLField({ nullable: true })
  firstName?: string;

  @TypeGraphQLField({ nullable: true })
  lastName?: string;
}

@ArgsType()
export class UserWhereArgs extends PaginationArgs {
  @TypeGraphQLField(() => UserWhereInput, { nullable: true })
  where?: UserWhereInput;

  @TypeGraphQLField(() => UserOrderByEnum, { nullable: true })
  orderBy?: UserOrderByEnum;
}

@ArgsType()
export class UserCreateManyArgs {
  @TypeGraphQLField(() => [UserCreateInput])
  data!: UserCreateInput[];
}

@ArgsType()
export class UserUpdateArgs {
  @TypeGraphQLField() data!: UserUpdateInput;
  @TypeGraphQLField() where!: UserWhereUniqueInput;
}
