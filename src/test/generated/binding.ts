import 'graphql-import-node'; // Needed so you can import *.graphql files 

import { makeBindingClass, Options } from 'graphql-binding'
import { GraphQLResolveInfo, GraphQLSchema } from 'graphql'
import { IResolvers } from 'graphql-tools/dist/Interfaces'
import * as schema from  './schema.graphql'

export interface Query {
    dishes: <T = Array<Dish>>(args: { offset?: Int | null, limit?: Int | null, where?: DishWhereInput | null, orderBy?: DishOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    dishConnection: <T = DishConnection>(args: { offset?: Int | null, limit?: Int | null, where?: DishWhereInput | null, orderBy?: DishOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    dish: <T = Dish>(args: { where: DishWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    kitchenSinks: <T = Array<KitchenSink>>(args: { offset?: Int | null, limit?: Int | null, where?: KitchenSinkWhereInput | null, orderBy?: KitchenSinkOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    kitchenSink: <T = KitchenSink>(args: { where: KitchenSinkWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
  }

export interface Mutation {
    createDish: <T = Dish>(args: { data: DishCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateDish: <T = Dish>(args: { data: DishUpdateInput, where: DishWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createManyDishs: <T = Array<Dish>>(args: { data: Array<DishCreateInput> }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteDish: <T = StandardDeleteResponse>(args: { where: DishWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    successfulTransaction: <T = Array<Dish>>(args: { data: DishCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    failedTransaction: <T = Array<Dish>>(args: { data: DishCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createKitchenSink: <T = KitchenSink>(args: { data: KitchenSinkCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createManyKitchenSinks: <T = Array<KitchenSink>>(args: { data: Array<KitchenSinkCreateInput> }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateKitchenSink: <T = KitchenSink>(args: { data: KitchenSinkUpdateInput, where: KitchenSinkWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteKitchenSink: <T = StandardDeleteResponse>(args: { where: KitchenSinkWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
  }

export interface Subscription {}

export interface Binding {
  query: Query
  mutation: Mutation
  subscription: Subscription
  request: <T = any>(query: string, variables?: {[key: string]: any}) => Promise<T>
  delegate(operation: 'query' | 'mutation', fieldName: string, args: {
      [key: string]: any;
  }, infoOrQuery?: GraphQLResolveInfo | string, options?: Options): Promise<any>;
  delegateSubscription(fieldName: string, args?: {
      [key: string]: any;
  }, infoOrQuery?: GraphQLResolveInfo | string, options?: Options): Promise<AsyncIterator<any>>;
  getAbstractResolvers(filterSchema?: GraphQLSchema | string): IResolvers;
}

export interface BindingConstructor<T> {
  new(...args: any[]): T
}

export const Binding = makeBindingClass<BindingConstructor<Binding>>({ schema: schema as any })

/**
 * Types
*/

export type DishOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'name_ASC' |
  'name_DESC' |
  'kitchenSinkId_ASC' |
  'kitchenSinkId_DESC'

export type KitchenSinkOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'stringField_ASC' |
  'stringField_DESC' |
  'nullableStringField_ASC' |
  'nullableStringField_DESC' |
  'dateField_ASC' |
  'dateField_DESC' |
  'dateOnlyField_ASC' |
  'dateOnlyField_DESC' |
  'dateTimeField_ASC' |
  'dateTimeField_DESC' |
  'emailField_ASC' |
  'emailField_DESC' |
  'integerField_ASC' |
  'integerField_DESC' |
  'booleanField_ASC' |
  'booleanField_DESC' |
  'floatField_ASC' |
  'floatField_DESC' |
  'idField_ASC' |
  'idField_DESC' |
  'stringEnumField_ASC' |
  'stringEnumField_DESC' |
  'numericField_ASC' |
  'numericField_DESC' |
  'numericFieldCustomPrecisionScale_ASC' |
  'numericFieldCustomPrecisionScale_DESC' |
  'noFilterField_ASC' |
  'noFilterField_DESC' |
  'characterField_ASC' |
  'characterField_DESC' |
  'readonlyField_ASC' |
  'readonlyField_DESC' |
  'apiOnlyField_ASC' |
  'apiOnlyField_DESC'

export type StringEnum =   'FOO' |
  'BAR'

export interface ApiOnlyCreateInput {
  name: String
}

export interface ApiOnlyUpdateInput {
  name?: String | null
}

export interface ApiOnlyWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  createdAt_eq?: DateTime | null
  createdAt_lt?: DateTime | null
  createdAt_lte?: DateTime | null
  createdAt_gt?: DateTime | null
  createdAt_gte?: DateTime | null
  createdById_eq?: ID_Input | null
  createdById_in?: ID_Output[] | ID_Output | null
  updatedAt_eq?: DateTime | null
  updatedAt_lt?: DateTime | null
  updatedAt_lte?: DateTime | null
  updatedAt_gt?: DateTime | null
  updatedAt_gte?: DateTime | null
  updatedById_eq?: ID_Input | null
  updatedById_in?: ID_Output[] | ID_Output | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: DateTime | null
  deletedAt_lt?: DateTime | null
  deletedAt_lte?: DateTime | null
  deletedAt_gt?: DateTime | null
  deletedAt_gte?: DateTime | null
  deletedById_eq?: ID_Input | null
  deletedById_in?: ID_Output[] | ID_Output | null
  name_eq?: String | null
  name_contains?: String | null
  name_startsWith?: String | null
  name_endsWith?: String | null
  name_in?: String[] | String | null
}

export interface ApiOnlyWhereUniqueInput {
  id: ID_Output
}

export interface BaseWhereInput {
  id_eq?: String | null
  id_in?: String[] | String | null
  createdAt_eq?: String | null
  createdAt_lt?: String | null
  createdAt_lte?: String | null
  createdAt_gt?: String | null
  createdAt_gte?: String | null
  createdById_eq?: String | null
  updatedAt_eq?: String | null
  updatedAt_lt?: String | null
  updatedAt_lte?: String | null
  updatedAt_gt?: String | null
  updatedAt_gte?: String | null
  updatedById_eq?: String | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: String | null
  deletedAt_lt?: String | null
  deletedAt_lte?: String | null
  deletedAt_gt?: String | null
  deletedAt_gte?: String | null
  deletedById_eq?: String | null
}

export interface DishCreateInput {
  name: String
  kitchenSinkId: ID_Output
}

export interface DishUpdateInput {
  name?: String | null
  kitchenSinkId?: ID_Input | null
}

export interface DishWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  createdAt_eq?: DateTime | null
  createdAt_lt?: DateTime | null
  createdAt_lte?: DateTime | null
  createdAt_gt?: DateTime | null
  createdAt_gte?: DateTime | null
  createdById_eq?: ID_Input | null
  createdById_in?: ID_Output[] | ID_Output | null
  updatedAt_eq?: DateTime | null
  updatedAt_lt?: DateTime | null
  updatedAt_lte?: DateTime | null
  updatedAt_gt?: DateTime | null
  updatedAt_gte?: DateTime | null
  updatedById_eq?: ID_Input | null
  updatedById_in?: ID_Output[] | ID_Output | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: DateTime | null
  deletedAt_lt?: DateTime | null
  deletedAt_lte?: DateTime | null
  deletedAt_gt?: DateTime | null
  deletedAt_gte?: DateTime | null
  deletedById_eq?: ID_Input | null
  deletedById_in?: ID_Output[] | ID_Output | null
  name_eq?: String | null
  name_contains?: String | null
  name_startsWith?: String | null
  name_endsWith?: String | null
  name_in?: String[] | String | null
  kitchenSinkId_eq?: ID_Input | null
  kitchenSinkId_in?: ID_Output[] | ID_Output | null
}

export interface DishWhereUniqueInput {
  id: ID_Output
}

export interface KitchenSinkCreateInput {
  stringField: String
  nullableStringField?: String | null
  dateField?: DateTime | null
  dateOnlyField?: Date | null
  dateTimeField?: DateTime | null
  emailField: String
  integerField: Float
  booleanField: Boolean
  floatField: Float
  jsonField?: JSONObject | null
  idField?: ID_Input | null
  stringEnumField?: StringEnum | null
  numericField?: Float | null
  numericFieldCustomPrecisionScale?: Float | null
  noFilterField?: String | null
  noSortField?: String | null
  noFilterOrSortField?: String | null
  stringFieldFilterEqContains?: String | null
  intFieldFilterLteGte?: Float | null
  characterField?: String | null
  customTextFieldNoSortOrFilter?: String | null
  writeonlyField?: String | null
  apiOnlyField?: String | null
}

export interface KitchenSinkUpdateInput {
  stringField?: String | null
  nullableStringField?: String | null
  dateField?: DateTime | null
  dateOnlyField?: Date | null
  dateTimeField?: DateTime | null
  emailField?: String | null
  integerField?: Float | null
  booleanField?: Boolean | null
  floatField?: Float | null
  jsonField?: JSONObject | null
  idField?: ID_Input | null
  stringEnumField?: StringEnum | null
  numericField?: Float | null
  numericFieldCustomPrecisionScale?: Float | null
  noFilterField?: String | null
  noSortField?: String | null
  noFilterOrSortField?: String | null
  stringFieldFilterEqContains?: String | null
  intFieldFilterLteGte?: Float | null
  characterField?: String | null
  customTextFieldNoSortOrFilter?: String | null
  writeonlyField?: String | null
  apiOnlyField?: String | null
}

export interface KitchenSinkWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  createdAt_eq?: DateTime | null
  createdAt_lt?: DateTime | null
  createdAt_lte?: DateTime | null
  createdAt_gt?: DateTime | null
  createdAt_gte?: DateTime | null
  createdById_eq?: ID_Input | null
  createdById_in?: ID_Output[] | ID_Output | null
  updatedAt_eq?: DateTime | null
  updatedAt_lt?: DateTime | null
  updatedAt_lte?: DateTime | null
  updatedAt_gt?: DateTime | null
  updatedAt_gte?: DateTime | null
  updatedById_eq?: ID_Input | null
  updatedById_in?: ID_Output[] | ID_Output | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: DateTime | null
  deletedAt_lt?: DateTime | null
  deletedAt_lte?: DateTime | null
  deletedAt_gt?: DateTime | null
  deletedAt_gte?: DateTime | null
  deletedById_eq?: ID_Input | null
  deletedById_in?: ID_Output[] | ID_Output | null
  stringField_eq?: String | null
  stringField_contains?: String | null
  stringField_startsWith?: String | null
  stringField_endsWith?: String | null
  stringField_in?: String[] | String | null
  nullableStringField_eq?: String | null
  nullableStringField_contains?: String | null
  nullableStringField_startsWith?: String | null
  nullableStringField_endsWith?: String | null
  nullableStringField_in?: String[] | String | null
  dateField_eq?: DateTime | null
  dateField_lt?: DateTime | null
  dateField_lte?: DateTime | null
  dateField_gt?: DateTime | null
  dateField_gte?: DateTime | null
  dateOnlyField_eq?: Date | null
  dateOnlyField_lt?: Date | null
  dateOnlyField_lte?: Date | null
  dateOnlyField_gt?: Date | null
  dateOnlyField_gte?: Date | null
  dateTimeField_eq?: DateTime | null
  dateTimeField_lt?: DateTime | null
  dateTimeField_lte?: DateTime | null
  dateTimeField_gt?: DateTime | null
  dateTimeField_gte?: DateTime | null
  emailField_eq?: String | null
  emailField_contains?: String | null
  emailField_startsWith?: String | null
  emailField_endsWith?: String | null
  emailField_in?: String[] | String | null
  integerField_eq?: Int | null
  integerField_gt?: Int | null
  integerField_gte?: Int | null
  integerField_lt?: Int | null
  integerField_lte?: Int | null
  integerField_in?: Int[] | Int | null
  booleanField_eq?: Boolean | null
  booleanField_in?: Boolean[] | Boolean | null
  floatField_eq?: Float | null
  floatField_gt?: Float | null
  floatField_gte?: Float | null
  floatField_lt?: Float | null
  floatField_lte?: Float | null
  floatField_in?: Float[] | Float | null
  jsonField_json?: JSONObject | null
  idField_eq?: ID_Input | null
  idField_in?: ID_Output[] | ID_Output | null
  stringEnumField_eq?: StringEnum | null
  stringEnumField_in?: StringEnum[] | StringEnum | null
  numericField_eq?: Float | null
  numericField_gt?: Float | null
  numericField_gte?: Float | null
  numericField_lt?: Float | null
  numericField_lte?: Float | null
  numericField_in?: Float[] | Float | null
  numericFieldCustomPrecisionScale_eq?: Float | null
  numericFieldCustomPrecisionScale_gt?: Float | null
  numericFieldCustomPrecisionScale_gte?: Float | null
  numericFieldCustomPrecisionScale_lt?: Float | null
  numericFieldCustomPrecisionScale_lte?: Float | null
  numericFieldCustomPrecisionScale_in?: Float[] | Float | null
  noSortField_eq?: String | null
  noSortField_contains?: String | null
  noSortField_startsWith?: String | null
  noSortField_endsWith?: String | null
  noSortField_in?: String[] | String | null
  stringFieldFilterEqContains_eq?: String | null
  stringFieldFilterEqContains_contains?: String | null
  intFieldFilterLteGte_gte?: Int | null
  intFieldFilterLteGte_lte?: Int | null
  characterField_eq?: String | null
  characterField_contains?: String | null
  characterField_startsWith?: String | null
  characterField_endsWith?: String | null
  characterField_in?: String[] | String | null
  readonlyField_eq?: String | null
  readonlyField_contains?: String | null
  readonlyField_startsWith?: String | null
  readonlyField_endsWith?: String | null
  readonlyField_in?: String[] | String | null
  apiOnlyField_eq?: String | null
  apiOnlyField_contains?: String | null
  apiOnlyField_startsWith?: String | null
  apiOnlyField_endsWith?: String | null
  apiOnlyField_in?: String[] | String | null
}

export interface KitchenSinkWhereUniqueInput {
  id?: ID_Input | null
  emailField?: String | null
}

export interface BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
}

export interface DeleteResponse {
  id: ID_Output
}

export interface ApiOnly extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  name: String
}

export interface BaseModel extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
}

export interface BaseModelUUID extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
}

export interface Dish extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  name: String
  kitchenSink: KitchenSink
  kitchenSinkId: String
}

export interface DishConnection {
  nodes: Array<Dish>
  pageInfo: PageInfo
}

export interface KitchenSink extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  stringField: String
  nullableStringField?: String | null
  dateField?: DateTime | null
  dateOnlyField?: Date | null
  dateTimeField?: DateTime | null
  emailField: String
  integerField: Int
  booleanField: Boolean
  floatField: Float
  jsonField?: JSONObject | null
  idField?: String | null
  stringEnumField?: StringEnum | null
  dishes?: Array<Dish> | null
  numericField?: Float | null
  numericFieldCustomPrecisionScale?: Float | null
  noFilterField?: String | null
  noSortField?: String | null
  noFilterOrSortField?: String | null
  stringFieldFilterEqContains?: String | null
  intFieldFilterLteGte?: Int | null
  characterField?: String | null
  customTextFieldNoSortOrFilter?: String | null
  readonlyField?: String | null
  apiOnlyField?: String | null
}

export interface PageInfo {
  limit: Float
  offset: Float
  totalCount: Float
  hasNextPage: Boolean
  hasPreviousPage: Boolean
}

export interface StandardDeleteResponse {
  id: ID_Output
}

/*
The `Boolean` scalar type represents `true` or `false`.
*/
export type Boolean = boolean

/*
A date string, such as 2007-12-03, compliant with the `full-date` format
outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for
representation of dates and times using the Gregorian calendar.
*/
export type Date = string

/*
The javascript `Date` as string. Type represents date and time as the ISO Date string.
*/
export type DateTime = Date | string

/*
The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).
*/
export type Float = number

/*
The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
*/
export type ID_Input = string | number
export type ID_Output = string

/*
The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
*/
export type Int = number

/*
The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
*/

    export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

    export type JsonPrimitive = string | number | boolean | null | {};
    
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface JsonArray extends Array<JsonValue> {}
    
    export type JsonObject = { [member: string]: JsonValue };

    export type JSONObject = JsonObject;
  

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string