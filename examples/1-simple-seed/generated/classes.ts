// tslint:disable:variable-name

// This is an auto-generated file
// Do not update directly, please update models
import { ArgsType, Field, InputType } from "type-graphql";
import { registerEnumType } from "type-graphql";
import { BaseWhereInput, PaginationArgs } from "../../../src";

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

  email_ASC = "email_ASC",
  email_DESC = "email_DESC",

  nickName_ASC = "nickName_ASC",
  nickName_DESC = "nickName_DESC",

  privateField_ASC = "privateField_ASC",
  privateField_DESC = "privateField_DESC"
}

registerEnumType(UserOrderByEnum, {
  name: "UserOrderByInput"
});

@InputType()
export class UserWhereInput extends BaseWhereInput {
  @Field({ nullable: true })
  firstName_eq?: string;

  @Field({ nullable: true })
  firstName_contains?: string;

  @Field({ nullable: true })
  firstName_startsWith?: string;

  @Field({ nullable: true })
  firstName_endsWith?: string;

  @Field(type => [String], { nullable: true })
  firstName_in?: string[];

  @Field({ nullable: true })
  lastName_eq?: string;

  @Field({ nullable: true })
  lastName_contains?: string;

  @Field({ nullable: true })
  lastName_startsWith?: string;

  @Field({ nullable: true })
  lastName_endsWith?: string;

  @Field(type => [String], { nullable: true })
  lastName_in?: string[];

  @Field({ nullable: true })
  email_eq?: string;

  @Field({ nullable: true })
  email_contains?: string;

  @Field({ nullable: true })
  email_startsWith?: string;

  @Field({ nullable: true })
  email_endsWith?: string;

  @Field(type => [String], { nullable: true })
  email_in?: string[];

  @Field({ nullable: true })
  nickName_eq?: string;

  @Field({ nullable: true })
  nickName_contains?: string;

  @Field({ nullable: true })
  nickName_startsWith?: string;

  @Field({ nullable: true })
  nickName_endsWith?: string;

  @Field(type => [String], { nullable: true })
  nickName_in?: string[];

  @Field({ nullable: true })
  privateField_eq?: string;

  @Field({ nullable: true })
  privateField_contains?: string;

  @Field({ nullable: true })
  privateField_startsWith?: string;

  @Field({ nullable: true })
  privateField_endsWith?: string;

  @Field(type => [String], { nullable: true })
  privateField_in?: string[];
}

@ArgsType()
export class UserWhereArgs extends PaginationArgs {
  @Field(type => UserWhereInput, { nullable: true })
  where?: UserWhereInput;

  @Field(type => UserOrderByEnum, { nullable: true })
  orderBy?: UserOrderByEnum;
}

@InputType()
export class UserWhereUniqueInput {
  @Field(type => String, { nullable: true })
  id?: string;

  @Field(type => String, { nullable: true })
  email?: string;
}

@InputType()
export class UserCreateInput {
  @Field() firstName!: string;

  @Field() lastName!: string;

  @Field() email!: string;

  @Field({ nullable: true }) nickName?: string;

  @Field({ nullable: true }) privateField?: string;
}

@InputType()
export class UserUpdateInput {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  nickName?: string;

  @Field({ nullable: true })
  privateField?: string;
}

@ArgsType()
export class UserUpdateArgs {
  @Field() data!: UserUpdateInput;
  @Field() where!: UserWhereUniqueInput;
}

// tslint:enable:variable-name
