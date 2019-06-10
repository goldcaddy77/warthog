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
import { StringEnum } from "../src/modules/user/user.model";
import { User } from "../src/modules/user/user.model";

export enum UserOrderByEnum {
  createdAt_ASC = "createdAt_ASC",
  createdAt_DESC = "createdAt_DESC",

  updatedAt_ASC = "updatedAt_ASC",
  updatedAt_DESC = "updatedAt_DESC",

  deletedAt_ASC = "deletedAt_ASC",
  deletedAt_DESC = "deletedAt_DESC",

  firstName_ASC = "firstName_ASC",
  firstName_DESC = "firstName_DESC",

  lastName_ASC = "lastName_ASC",
  lastName_DESC = "lastName_DESC",

  stringEnumField_ASC = "stringEnumField_ASC",
  stringEnumField_DESC = "stringEnumField_DESC",

  email_ASC = "email_ASC",
  email_DESC = "email_DESC",

  nickName_ASC = "nickName_ASC",
  nickName_DESC = "nickName_DESC",

  privateField_ASC = "privateField_ASC",
  privateField_DESC = "privateField_DESC",

  jsonField_ASC = "jsonField_ASC",
  jsonField_DESC = "jsonField_DESC"
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

  @TypeGraphQLField({ nullable: true })
  lastName_eq?: string;

  @TypeGraphQLField({ nullable: true })
  lastName_contains?: string;

  @TypeGraphQLField({ nullable: true })
  lastName_startsWith?: string;

  @TypeGraphQLField({ nullable: true })
  lastName_endsWith?: string;

  @TypeGraphQLField(type => [String], { nullable: true })
  lastName_in?: string[];

  @TypeGraphQLField(type => StringEnum, { nullable: true })
  stringEnumField_eq?: StringEnum;

  @TypeGraphQLField(type => [StringEnum], { nullable: true })
  stringEnumField_in?: StringEnum[];

  @TypeGraphQLField({ nullable: true })
  email_eq?: string;

  @TypeGraphQLField({ nullable: true })
  email_contains?: string;

  @TypeGraphQLField({ nullable: true })
  email_startsWith?: string;

  @TypeGraphQLField({ nullable: true })
  email_endsWith?: string;

  @TypeGraphQLField(type => [String], { nullable: true })
  email_in?: string[];

  @TypeGraphQLField({ nullable: true })
  nickName_eq?: string;

  @TypeGraphQLField({ nullable: true })
  nickName_contains?: string;

  @TypeGraphQLField({ nullable: true })
  nickName_startsWith?: string;

  @TypeGraphQLField({ nullable: true })
  nickName_endsWith?: string;

  @TypeGraphQLField(type => [String], { nullable: true })
  nickName_in?: string[];

  @TypeGraphQLField({ nullable: true })
  privateField_eq?: string;

  @TypeGraphQLField({ nullable: true })
  privateField_contains?: string;

  @TypeGraphQLField({ nullable: true })
  privateField_startsWith?: string;

  @TypeGraphQLField({ nullable: true })
  privateField_endsWith?: string;

  @TypeGraphQLField(type => [String], { nullable: true })
  privateField_in?: string[];
}

@TypeGraphQLInputType()
export class UserWhereUniqueInput {
  @TypeGraphQLField(type => String, { nullable: true })
  id?: string;

  @TypeGraphQLField(type => String, { nullable: true })
  firstName?: string;

  @TypeGraphQLField(type => StringEnum, { nullable: true })
  stringEnumField?: StringEnum;

  @TypeGraphQLField(type => String, { nullable: true })
  email?: string;
}

@TypeGraphQLInputType()
export class UserCreateInput {
  @TypeGraphQLField()
  firstName!: string;

  @TypeGraphQLField()
  lastName!: string;

  @TypeGraphQLField(type => StringEnum)
  stringEnumField!: StringEnum;

  @TypeGraphQLField()
  email!: string;

  @TypeGraphQLField({ nullable: true })
  nickName?: string;

  @TypeGraphQLField({ nullable: true })
  privateField?: string;

  @TypeGraphQLField(type => GraphQLJSONObject, { nullable: true })
  jsonField?: JSON;
}

@TypeGraphQLInputType()
export class UserUpdateInput {
  @TypeGraphQLField({ nullable: true })
  firstName?: string;

  @TypeGraphQLField({ nullable: true })
  lastName?: string;

  @TypeGraphQLField(type => StringEnum, { nullable: true })
  stringEnumField?: StringEnum;

  @TypeGraphQLField({ nullable: true })
  email?: string;

  @TypeGraphQLField({ nullable: true })
  nickName?: string;

  @TypeGraphQLField({ nullable: true })
  privateField?: string;

  @TypeGraphQLField(type => GraphQLJSONObject, { nullable: true })
  jsonField?: JSON;
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
