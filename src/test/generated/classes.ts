// This file has been auto-generated by Warthog.  Do not update directly as it
// will be re-written.  If you need to change this file, update models or add
// new TypeGraphQL objects
// @ts-ignore
import { DateResolver as Date } from "graphql-scalars";
// @ts-ignore
import { GraphQLID as ID } from "graphql";
// @ts-ignore
import {
  ArgsType,
  Field as TypeGraphQLField,
  Float,
  InputType as TypeGraphQLInputType,
  Int
} from "type-graphql";
// @ts-ignore
import { registerEnumType, GraphQLISODateTime as DateTime } from "type-graphql";

// @ts-ignore eslint-disable-next-line @typescript-eslint/no-var-requires
const { GraphQLJSONObject } = require("graphql-type-json");

// @ts-ignore
import {
  BaseWhereInput,
  JsonObject,
  PaginationArgs,
  DateOnlyString,
  DateTimeString
} from "../../";
import { StringEnum } from "../modules/kitchen-sink/kitchen-sink.model";
// @ts-ignore
import { ApiOnly } from "../modules/api-only/api-only.model";
// @ts-ignore
import { KitchenSink } from "../modules/kitchen-sink/kitchen-sink.model";
// @ts-ignore
import { Dish } from "../modules/dish/dish.model";

export enum ApiOnlyOrderByEnum {
  createdAt_ASC = "createdAt_ASC",
  createdAt_DESC = "createdAt_DESC",

  updatedAt_ASC = "updatedAt_ASC",
  updatedAt_DESC = "updatedAt_DESC",

  deletedAt_ASC = "deletedAt_ASC",
  deletedAt_DESC = "deletedAt_DESC",

  name_ASC = "name_ASC",
  name_DESC = "name_DESC"
}

registerEnumType(ApiOnlyOrderByEnum, {
  name: "ApiOnlyOrderByInput"
});

@TypeGraphQLInputType()
export class ApiOnlyWhereInput {
  @TypeGraphQLField(() => ID, { nullable: true })
  id_eq?: string;

  @TypeGraphQLField(() => [ID], { nullable: true })
  id_in?: string[];

  @TypeGraphQLField(() => DateTime, { nullable: true })
  createdAt_eq?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  createdAt_lt?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  createdAt_lte?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  createdAt_gt?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  createdAt_gte?: Date;

  @TypeGraphQLField(() => ID, { nullable: true })
  createdById_eq?: string;

  @TypeGraphQLField(() => [ID], { nullable: true })
  createdById_in?: string[];

  @TypeGraphQLField(() => DateTime, { nullable: true })
  updatedAt_eq?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  updatedAt_lt?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  updatedAt_lte?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  updatedAt_gt?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  updatedAt_gte?: Date;

  @TypeGraphQLField(() => ID, { nullable: true })
  updatedById_eq?: string;

  @TypeGraphQLField(() => [ID], { nullable: true })
  updatedById_in?: string[];

  @TypeGraphQLField({ nullable: true })
  deletedAt_all?: Boolean;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  deletedAt_eq?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  deletedAt_lt?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  deletedAt_lte?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  deletedAt_gt?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  deletedAt_gte?: Date;

  @TypeGraphQLField(() => ID, { nullable: true })
  deletedById_eq?: string;

  @TypeGraphQLField(() => [ID], { nullable: true })
  deletedById_in?: string[];

  @TypeGraphQLField({ nullable: true })
  name_eq?: string;

  @TypeGraphQLField({ nullable: true })
  name_contains?: string;

  @TypeGraphQLField({ nullable: true })
  name_startsWith?: string;

  @TypeGraphQLField({ nullable: true })
  name_endsWith?: string;

  @TypeGraphQLField(() => [String], { nullable: true })
  name_in?: string[];
}

@TypeGraphQLInputType()
export class ApiOnlyWhereUniqueInput {
  @TypeGraphQLField(() => ID)
  id?: string;
}

@TypeGraphQLInputType()
export class ApiOnlyCreateInput {
  @TypeGraphQLField()
  name!: string;
}

@TypeGraphQLInputType()
export class ApiOnlyUpdateInput {
  @TypeGraphQLField({ nullable: true })
  name?: string;
}

@ArgsType()
export class ApiOnlyWhereArgs extends PaginationArgs {
  @TypeGraphQLField(() => ApiOnlyWhereInput, { nullable: true })
  where?: ApiOnlyWhereInput;

  @TypeGraphQLField(() => ApiOnlyOrderByEnum, { nullable: true })
  orderBy?: ApiOnlyOrderByEnum;
}

@ArgsType()
export class ApiOnlyCreateManyArgs {
  @TypeGraphQLField(() => [ApiOnlyCreateInput])
  data!: ApiOnlyCreateInput[];
}

@ArgsType()
export class ApiOnlyUpdateArgs {
  @TypeGraphQLField() data!: ApiOnlyUpdateInput;
  @TypeGraphQLField() where!: ApiOnlyWhereUniqueInput;
}

export enum KitchenSinkOrderByEnum {
  createdAt_ASC = "createdAt_ASC",
  createdAt_DESC = "createdAt_DESC",

  updatedAt_ASC = "updatedAt_ASC",
  updatedAt_DESC = "updatedAt_DESC",

  deletedAt_ASC = "deletedAt_ASC",
  deletedAt_DESC = "deletedAt_DESC",

  stringField_ASC = "stringField_ASC",
  stringField_DESC = "stringField_DESC",

  nullableStringField_ASC = "nullableStringField_ASC",
  nullableStringField_DESC = "nullableStringField_DESC",

  dateField_ASC = "dateField_ASC",
  dateField_DESC = "dateField_DESC",

  dateOnlyField_ASC = "dateOnlyField_ASC",
  dateOnlyField_DESC = "dateOnlyField_DESC",

  dateTimeField_ASC = "dateTimeField_ASC",
  dateTimeField_DESC = "dateTimeField_DESC",

  emailField_ASC = "emailField_ASC",
  emailField_DESC = "emailField_DESC",

  integerField_ASC = "integerField_ASC",
  integerField_DESC = "integerField_DESC",

  booleanField_ASC = "booleanField_ASC",
  booleanField_DESC = "booleanField_DESC",

  floatField_ASC = "floatField_ASC",
  floatField_DESC = "floatField_DESC",

  idField_ASC = "idField_ASC",
  idField_DESC = "idField_DESC",

  stringEnumField_ASC = "stringEnumField_ASC",
  stringEnumField_DESC = "stringEnumField_DESC",

  numericField_ASC = "numericField_ASC",
  numericField_DESC = "numericField_DESC",

  numericFieldCustomPrecisionScale_ASC = "numericFieldCustomPrecisionScale_ASC",
  numericFieldCustomPrecisionScale_DESC = "numericFieldCustomPrecisionScale_DESC",

  noFilterField_ASC = "noFilterField_ASC",
  noFilterField_DESC = "noFilterField_DESC",

  characterField_ASC = "characterField_ASC",
  characterField_DESC = "characterField_DESC",

  readonlyField_ASC = "readonlyField_ASC",
  readonlyField_DESC = "readonlyField_DESC",

  apiOnlyField_ASC = "apiOnlyField_ASC",
  apiOnlyField_DESC = "apiOnlyField_DESC"
}

registerEnumType(KitchenSinkOrderByEnum, {
  name: "KitchenSinkOrderByInput"
});

@TypeGraphQLInputType()
export class KitchenSinkWhereInput {
  @TypeGraphQLField(() => ID, { nullable: true })
  id_eq?: string;

  @TypeGraphQLField(() => [ID], { nullable: true })
  id_in?: string[];

  @TypeGraphQLField(() => DateTime, { nullable: true })
  createdAt_eq?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  createdAt_lt?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  createdAt_lte?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  createdAt_gt?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  createdAt_gte?: Date;

  @TypeGraphQLField(() => ID, { nullable: true })
  createdById_eq?: string;

  @TypeGraphQLField(() => [ID], { nullable: true })
  createdById_in?: string[];

  @TypeGraphQLField(() => DateTime, { nullable: true })
  updatedAt_eq?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  updatedAt_lt?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  updatedAt_lte?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  updatedAt_gt?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  updatedAt_gte?: Date;

  @TypeGraphQLField(() => ID, { nullable: true })
  updatedById_eq?: string;

  @TypeGraphQLField(() => [ID], { nullable: true })
  updatedById_in?: string[];

  @TypeGraphQLField({ nullable: true })
  deletedAt_all?: Boolean;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  deletedAt_eq?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  deletedAt_lt?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  deletedAt_lte?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  deletedAt_gt?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  deletedAt_gte?: Date;

  @TypeGraphQLField(() => ID, { nullable: true })
  deletedById_eq?: string;

  @TypeGraphQLField(() => [ID], { nullable: true })
  deletedById_in?: string[];

  @TypeGraphQLField({ nullable: true })
  stringField_eq?: string;

  @TypeGraphQLField({ nullable: true })
  stringField_contains?: string;

  @TypeGraphQLField({ nullable: true })
  stringField_startsWith?: string;

  @TypeGraphQLField({ nullable: true })
  stringField_endsWith?: string;

  @TypeGraphQLField(() => [String], { nullable: true })
  stringField_in?: string[];

  @TypeGraphQLField({ nullable: true })
  nullableStringField_eq?: string;

  @TypeGraphQLField({ nullable: true })
  nullableStringField_contains?: string;

  @TypeGraphQLField({ nullable: true })
  nullableStringField_startsWith?: string;

  @TypeGraphQLField({ nullable: true })
  nullableStringField_endsWith?: string;

  @TypeGraphQLField(() => [String], { nullable: true })
  nullableStringField_in?: string[];

  @TypeGraphQLField(() => DateTime, { nullable: true })
  dateField_eq?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  dateField_lt?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  dateField_lte?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  dateField_gt?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  dateField_gte?: Date;

  @TypeGraphQLField(() => Date, { nullable: true })
  dateOnlyField_eq?: DateOnlyString;

  @TypeGraphQLField(() => Date, { nullable: true })
  dateOnlyField_lt?: DateOnlyString;

  @TypeGraphQLField(() => Date, { nullable: true })
  dateOnlyField_lte?: DateOnlyString;

  @TypeGraphQLField(() => Date, { nullable: true })
  dateOnlyField_gt?: DateOnlyString;

  @TypeGraphQLField(() => Date, { nullable: true })
  dateOnlyField_gte?: DateOnlyString;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  dateTimeField_eq?: DateTimeString;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  dateTimeField_lt?: DateTimeString;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  dateTimeField_lte?: DateTimeString;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  dateTimeField_gt?: DateTimeString;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  dateTimeField_gte?: DateTimeString;

  @TypeGraphQLField({ nullable: true })
  emailField_eq?: string;

  @TypeGraphQLField({ nullable: true })
  emailField_contains?: string;

  @TypeGraphQLField({ nullable: true })
  emailField_startsWith?: string;

  @TypeGraphQLField({ nullable: true })
  emailField_endsWith?: string;

  @TypeGraphQLField(() => [String], { nullable: true })
  emailField_in?: string[];

  @TypeGraphQLField(() => Int, { nullable: true })
  integerField_eq?: number;

  @TypeGraphQLField(() => Int, { nullable: true })
  integerField_gt?: number;

  @TypeGraphQLField(() => Int, { nullable: true })
  integerField_gte?: number;

  @TypeGraphQLField(() => Int, { nullable: true })
  integerField_lt?: number;

  @TypeGraphQLField(() => Int, { nullable: true })
  integerField_lte?: number;

  @TypeGraphQLField(() => [Int], { nullable: true })
  integerField_in?: number[];

  @TypeGraphQLField(() => Boolean, { nullable: true })
  booleanField_eq?: Boolean;

  @TypeGraphQLField(() => [Boolean], { nullable: true })
  booleanField_in?: Boolean[];

  @TypeGraphQLField(() => Float, { nullable: true })
  floatField_eq?: number;

  @TypeGraphQLField(() => Float, { nullable: true })
  floatField_gt?: number;

  @TypeGraphQLField(() => Float, { nullable: true })
  floatField_gte?: number;

  @TypeGraphQLField(() => Float, { nullable: true })
  floatField_lt?: number;

  @TypeGraphQLField(() => Float, { nullable: true })
  floatField_lte?: number;

  @TypeGraphQLField(() => [Float], { nullable: true })
  floatField_in?: number[];

  @TypeGraphQLField(() => GraphQLJSONObject, { nullable: true })
  jsonField_json?: JsonObject;

  @TypeGraphQLField(() => ID, { nullable: true })
  idField_eq?: string;

  @TypeGraphQLField(() => [ID], { nullable: true })
  idField_in?: string[];

  @TypeGraphQLField(() => StringEnum, { nullable: true })
  stringEnumField_eq?: StringEnum;

  @TypeGraphQLField(() => [StringEnum], { nullable: true })
  stringEnumField_in?: StringEnum[];

  @TypeGraphQLField(() => Float, { nullable: true })
  numericField_eq?: number;

  @TypeGraphQLField(() => Float, { nullable: true })
  numericField_gt?: number;

  @TypeGraphQLField(() => Float, { nullable: true })
  numericField_gte?: number;

  @TypeGraphQLField(() => Float, { nullable: true })
  numericField_lt?: number;

  @TypeGraphQLField(() => Float, { nullable: true })
  numericField_lte?: number;

  @TypeGraphQLField(() => [Float], { nullable: true })
  numericField_in?: number[];

  @TypeGraphQLField(() => Float, { nullable: true })
  numericFieldCustomPrecisionScale_eq?: number;

  @TypeGraphQLField(() => Float, { nullable: true })
  numericFieldCustomPrecisionScale_gt?: number;

  @TypeGraphQLField(() => Float, { nullable: true })
  numericFieldCustomPrecisionScale_gte?: number;

  @TypeGraphQLField(() => Float, { nullable: true })
  numericFieldCustomPrecisionScale_lt?: number;

  @TypeGraphQLField(() => Float, { nullable: true })
  numericFieldCustomPrecisionScale_lte?: number;

  @TypeGraphQLField(() => [Float], { nullable: true })
  numericFieldCustomPrecisionScale_in?: number[];

  @TypeGraphQLField({ nullable: true })
  noSortField_eq?: string;

  @TypeGraphQLField({ nullable: true })
  noSortField_contains?: string;

  @TypeGraphQLField({ nullable: true })
  noSortField_startsWith?: string;

  @TypeGraphQLField({ nullable: true })
  noSortField_endsWith?: string;

  @TypeGraphQLField(() => [String], { nullable: true })
  noSortField_in?: string[];

  @TypeGraphQLField({ nullable: true })
  stringFieldFilterEqContains_eq?: string;

  @TypeGraphQLField({ nullable: true })
  stringFieldFilterEqContains_contains?: string;

  @TypeGraphQLField(() => Int, { nullable: true })
  intFieldFilterLteGte_gte?: number;

  @TypeGraphQLField(() => Int, { nullable: true })
  intFieldFilterLteGte_lte?: number;

  @TypeGraphQLField({ nullable: true })
  characterField_eq?: string;

  @TypeGraphQLField({ nullable: true })
  characterField_contains?: string;

  @TypeGraphQLField({ nullable: true })
  characterField_startsWith?: string;

  @TypeGraphQLField({ nullable: true })
  characterField_endsWith?: string;

  @TypeGraphQLField(() => [String], { nullable: true })
  characterField_in?: string[];

  @TypeGraphQLField({ nullable: true })
  readonlyField_eq?: string;

  @TypeGraphQLField({ nullable: true })
  readonlyField_contains?: string;

  @TypeGraphQLField({ nullable: true })
  readonlyField_startsWith?: string;

  @TypeGraphQLField({ nullable: true })
  readonlyField_endsWith?: string;

  @TypeGraphQLField(() => [String], { nullable: true })
  readonlyField_in?: string[];

  @TypeGraphQLField({ nullable: true })
  apiOnlyField_eq?: string;

  @TypeGraphQLField({ nullable: true })
  apiOnlyField_contains?: string;

  @TypeGraphQLField({ nullable: true })
  apiOnlyField_startsWith?: string;

  @TypeGraphQLField({ nullable: true })
  apiOnlyField_endsWith?: string;

  @TypeGraphQLField(() => [String], { nullable: true })
  apiOnlyField_in?: string[];
}

@TypeGraphQLInputType()
export class KitchenSinkWhereUniqueInput {
  @TypeGraphQLField(() => ID, { nullable: true })
  id?: string;

  @TypeGraphQLField(() => String, { nullable: true })
  emailField?: string;
}

@TypeGraphQLInputType()
export class KitchenSinkCreateInput {
  @TypeGraphQLField()
  stringField!: string;

  @TypeGraphQLField({ nullable: true })
  nullableStringField?: string;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  dateField?: Date;

  @TypeGraphQLField(() => Date, { nullable: true })
  dateOnlyField?: DateOnlyString;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  dateTimeField?: DateTimeString;

  @TypeGraphQLField()
  emailField!: string;

  @TypeGraphQLField()
  integerField!: number;

  @TypeGraphQLField()
  booleanField!: boolean;

  @TypeGraphQLField()
  floatField!: number;

  @TypeGraphQLField(() => GraphQLJSONObject, { nullable: true })
  jsonField?: JsonObject;

  @TypeGraphQLField(() => ID, { nullable: true })
  idField?: string;

  @TypeGraphQLField(() => StringEnum, { nullable: true })
  stringEnumField?: StringEnum;

  @TypeGraphQLField({ nullable: true })
  numericField?: number;

  @TypeGraphQLField({ nullable: true })
  numericFieldCustomPrecisionScale?: number;

  @TypeGraphQLField({ nullable: true })
  noFilterField?: string;

  @TypeGraphQLField({ nullable: true })
  noSortField?: string;

  @TypeGraphQLField({ nullable: true })
  noFilterOrSortField?: string;

  @TypeGraphQLField({ nullable: true })
  stringFieldFilterEqContains?: string;

  @TypeGraphQLField({ nullable: true })
  intFieldFilterLteGte?: number;

  @TypeGraphQLField({ nullable: true })
  characterField?: string;

  @TypeGraphQLField({ nullable: true })
  customTextFieldNoSortOrFilter?: string;

  @TypeGraphQLField({ nullable: true })
  writeonlyField?: string;

  @TypeGraphQLField({ nullable: true })
  apiOnlyField?: string;
}

@TypeGraphQLInputType()
export class KitchenSinkUpdateInput {
  @TypeGraphQLField({ nullable: true })
  stringField?: string;

  @TypeGraphQLField({ nullable: true })
  nullableStringField?: string;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  dateField?: Date;

  @TypeGraphQLField(() => Date, { nullable: true })
  dateOnlyField?: DateOnlyString;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  dateTimeField?: DateTimeString;

  @TypeGraphQLField({ nullable: true })
  emailField?: string;

  @TypeGraphQLField({ nullable: true })
  integerField?: number;

  @TypeGraphQLField({ nullable: true })
  booleanField?: boolean;

  @TypeGraphQLField({ nullable: true })
  floatField?: number;

  @TypeGraphQLField(() => GraphQLJSONObject, { nullable: true })
  jsonField?: JsonObject;

  @TypeGraphQLField(() => ID, { nullable: true })
  idField?: string;

  @TypeGraphQLField(() => StringEnum, { nullable: true })
  stringEnumField?: StringEnum;

  @TypeGraphQLField({ nullable: true })
  numericField?: number;

  @TypeGraphQLField({ nullable: true })
  numericFieldCustomPrecisionScale?: number;

  @TypeGraphQLField({ nullable: true })
  noFilterField?: string;

  @TypeGraphQLField({ nullable: true })
  noSortField?: string;

  @TypeGraphQLField({ nullable: true })
  noFilterOrSortField?: string;

  @TypeGraphQLField({ nullable: true })
  stringFieldFilterEqContains?: string;

  @TypeGraphQLField({ nullable: true })
  intFieldFilterLteGte?: number;

  @TypeGraphQLField({ nullable: true })
  characterField?: string;

  @TypeGraphQLField({ nullable: true })
  customTextFieldNoSortOrFilter?: string;

  @TypeGraphQLField({ nullable: true })
  writeonlyField?: string;

  @TypeGraphQLField({ nullable: true })
  apiOnlyField?: string;
}

@ArgsType()
export class KitchenSinkWhereArgs extends PaginationArgs {
  @TypeGraphQLField(() => KitchenSinkWhereInput, { nullable: true })
  where?: KitchenSinkWhereInput;

  @TypeGraphQLField(() => KitchenSinkOrderByEnum, { nullable: true })
  orderBy?: KitchenSinkOrderByEnum;
}

@ArgsType()
export class KitchenSinkCreateManyArgs {
  @TypeGraphQLField(() => [KitchenSinkCreateInput])
  data!: KitchenSinkCreateInput[];
}

@ArgsType()
export class KitchenSinkUpdateArgs {
  @TypeGraphQLField() data!: KitchenSinkUpdateInput;
  @TypeGraphQLField() where!: KitchenSinkWhereUniqueInput;
}

export enum DishOrderByEnum {
  createdAt_ASC = "createdAt_ASC",
  createdAt_DESC = "createdAt_DESC",

  updatedAt_ASC = "updatedAt_ASC",
  updatedAt_DESC = "updatedAt_DESC",

  deletedAt_ASC = "deletedAt_ASC",
  deletedAt_DESC = "deletedAt_DESC",

  name_ASC = "name_ASC",
  name_DESC = "name_DESC",

  kitchenSinkId_ASC = "kitchenSinkId_ASC",
  kitchenSinkId_DESC = "kitchenSinkId_DESC"
}

registerEnumType(DishOrderByEnum, {
  name: "DishOrderByInput"
});

@TypeGraphQLInputType()
export class DishWhereInput {
  @TypeGraphQLField(() => ID, { nullable: true })
  id_eq?: string;

  @TypeGraphQLField(() => [ID], { nullable: true })
  id_in?: string[];

  @TypeGraphQLField(() => DateTime, { nullable: true })
  createdAt_eq?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  createdAt_lt?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  createdAt_lte?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  createdAt_gt?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  createdAt_gte?: Date;

  @TypeGraphQLField(() => ID, { nullable: true })
  createdById_eq?: string;

  @TypeGraphQLField(() => [ID], { nullable: true })
  createdById_in?: string[];

  @TypeGraphQLField(() => DateTime, { nullable: true })
  updatedAt_eq?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  updatedAt_lt?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  updatedAt_lte?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  updatedAt_gt?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  updatedAt_gte?: Date;

  @TypeGraphQLField(() => ID, { nullable: true })
  updatedById_eq?: string;

  @TypeGraphQLField(() => [ID], { nullable: true })
  updatedById_in?: string[];

  @TypeGraphQLField({ nullable: true })
  deletedAt_all?: Boolean;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  deletedAt_eq?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  deletedAt_lt?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  deletedAt_lte?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  deletedAt_gt?: Date;

  @TypeGraphQLField(() => DateTime, { nullable: true })
  deletedAt_gte?: Date;

  @TypeGraphQLField(() => ID, { nullable: true })
  deletedById_eq?: string;

  @TypeGraphQLField(() => [ID], { nullable: true })
  deletedById_in?: string[];

  @TypeGraphQLField({ nullable: true })
  name_eq?: string;

  @TypeGraphQLField({ nullable: true })
  name_contains?: string;

  @TypeGraphQLField({ nullable: true })
  name_startsWith?: string;

  @TypeGraphQLField({ nullable: true })
  name_endsWith?: string;

  @TypeGraphQLField(() => [String], { nullable: true })
  name_in?: string[];

  @TypeGraphQLField(() => ID, { nullable: true })
  kitchenSinkId_eq?: string;

  @TypeGraphQLField(() => [ID], { nullable: true })
  kitchenSinkId_in?: string[];
}

@TypeGraphQLInputType()
export class DishWhereUniqueInput {
  @TypeGraphQLField(() => ID)
  id?: string;
}

@TypeGraphQLInputType()
export class DishCreateInput {
  @TypeGraphQLField()
  name!: string;

  @TypeGraphQLField(() => ID)
  kitchenSinkId!: string;
}

@TypeGraphQLInputType()
export class DishUpdateInput {
  @TypeGraphQLField({ nullable: true })
  name?: string;

  @TypeGraphQLField(() => ID, { nullable: true })
  kitchenSinkId?: string;
}

@ArgsType()
export class DishWhereArgs extends PaginationArgs {
  @TypeGraphQLField(() => DishWhereInput, { nullable: true })
  where?: DishWhereInput;

  @TypeGraphQLField(() => DishOrderByEnum, { nullable: true })
  orderBy?: DishOrderByEnum;
}

@ArgsType()
export class DishCreateManyArgs {
  @TypeGraphQLField(() => [DishCreateInput])
  data!: DishCreateInput[];
}

@ArgsType()
export class DishUpdateArgs {
  @TypeGraphQLField() data!: DishUpdateInput;
  @TypeGraphQLField() where!: DishWhereUniqueInput;
}
