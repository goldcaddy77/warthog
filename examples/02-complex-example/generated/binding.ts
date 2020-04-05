import 'graphql-import-node'; // Needed so you can import *.graphql files 

import { makeBindingClass, Options } from 'graphql-binding'
import { GraphQLResolveInfo, GraphQLSchema } from 'graphql'
import { IResolvers } from 'graphql-tools/dist/Interfaces'
import * as schema from  './schema.graphql'

export interface Query {
    users: <T = Array<User>>(args: { offset?: Int | null, limit?: Int | null, where?: UserWhereInput | null, orderBy?: UserOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    user: <T = User>(args: { where: UserWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
  }

export interface Mutation {
    createUser: <T = User>(args: { data: UserCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateUser: <T = User>(args: { data: UserUpdateInput, where: UserWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteUser: <T = StandardDeleteResponse>(args: { where: UserWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
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

export type StringEnum =   'FOO' |
  'BAR'

export type UserOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'booleanField_ASC' |
  'booleanField_DESC' |
  'dateField_ASC' |
  'dateField_DESC' |
  'emailField_ASC' |
  'emailField_DESC' |
  'enumField_ASC' |
  'enumField_DESC' |
  'floatField_ASC' |
  'floatField_DESC' |
  'realField_ASC' |
  'realField_DESC' |
  'idField_ASC' |
  'idField_DESC' |
  'intFieldDefault_ASC' |
  'intFieldDefault_DESC' |
  'smallIntField_ASC' |
  'smallIntField_DESC' |
  'bigIntField_ASC' |
  'bigIntField_DESC' |
  'stringField_ASC' |
  'stringField_DESC' |
  'noFilterField_ASC' |
  'noFilterField_DESC' |
  'numericField_ASC' |
  'numericField_DESC' |
  'numericFieldCustomPrecisionScale_ASC' |
  'numericFieldCustomPrecisionScale_DESC' |
  'charField_ASC' |
  'charField_DESC' |
  'characterField_ASC' |
  'characterField_DESC' |
  'characterVaryingField_ASC' |
  'characterVaryingField_DESC' |
  'textField_ASC' |
  'textField_DESC' |
  'varcharField_ASC' |
  'varcharField_DESC' |
  'intField_ASC' |
  'intField_DESC' |
  'integerField_ASC' |
  'integerField_DESC' |
  'int2Field_ASC' |
  'int2Field_DESC' |
  'int4Field_ASC' |
  'int4Field_DESC' |
  'int8Field_ASC' |
  'int8Field_DESC' |
  'float4Field_ASC' |
  'float4Field_DESC' |
  'float8Field_ASC' |
  'float8Field_DESC' |
  'doublePrecisionField_ASC' |
  'doublePrecisionField_DESC' |
  'readonlyField_ASC' |
  'readonlyField_DESC'

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

export interface UserCreateInput {
  booleanField?: Boolean | null
  dateField?: DateTime | null
  emailField?: String | null
  enumField?: StringEnum | null
  floatField?: Float | null
  realField?: Float | null
  idField?: ID_Input | null
  intFieldDefault?: Float | null
  smallIntField?: Float | null
  bigIntField?: Float | null
  jsonField?: JSONObject | null
  jsonFieldNoFilter?: JSONObject | null
  stringField?: String | null
  noFilterField?: String | null
  noSortField?: String | null
  noFilterOrSortField?: String | null
  numericField?: Float | null
  numericFieldCustomPrecisionScale?: Float | null
  charField?: String | null
  characterField?: String | null
  characterVaryingField?: String | null
  textField?: String | null
  varcharField?: String | null
  geometryField?: JSONObject | null
  intField?: Float | null
  integerField?: Float | null
  int2Field?: Float | null
  int4Field?: Float | null
  int8Field?: Float | null
  float4Field?: Float | null
  float8Field?: Float | null
  doublePrecisionField?: Float | null
  password?: String | null
  writeonlyField?: String | null
}

export interface UserUpdateInput {
  booleanField?: Boolean | null
  dateField?: DateTime | null
  emailField?: String | null
  enumField?: StringEnum | null
  floatField?: Float | null
  realField?: Float | null
  idField?: ID_Input | null
  intFieldDefault?: Float | null
  smallIntField?: Float | null
  bigIntField?: Float | null
  jsonField?: JSONObject | null
  jsonFieldNoFilter?: JSONObject | null
  stringField?: String | null
  noFilterField?: String | null
  noSortField?: String | null
  noFilterOrSortField?: String | null
  numericField?: Float | null
  numericFieldCustomPrecisionScale?: Float | null
  charField?: String | null
  characterField?: String | null
  characterVaryingField?: String | null
  textField?: String | null
  varcharField?: String | null
  geometryField?: JSONObject | null
  intField?: Float | null
  integerField?: Float | null
  int2Field?: Float | null
  int4Field?: Float | null
  int8Field?: Float | null
  float4Field?: Float | null
  float8Field?: Float | null
  doublePrecisionField?: Float | null
  password?: String | null
  writeonlyField?: String | null
}

export interface UserWhereInput {
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
  booleanField_eq?: Boolean | null
  booleanField_in?: Boolean[] | Boolean | null
  dateField_eq?: DateTime | null
  dateField_lt?: DateTime | null
  dateField_lte?: DateTime | null
  dateField_gt?: DateTime | null
  dateField_gte?: DateTime | null
  emailField_eq?: String | null
  emailField_contains?: String | null
  emailField_startsWith?: String | null
  emailField_endsWith?: String | null
  emailField_in?: String[] | String | null
  enumField_eq?: StringEnum | null
  enumField_in?: StringEnum[] | StringEnum | null
  floatField_eq?: Float | null
  floatField_gt?: Float | null
  floatField_gte?: Float | null
  floatField_lt?: Float | null
  floatField_lte?: Float | null
  floatField_in?: Float[] | Float | null
  realField_eq?: Float | null
  realField_gt?: Float | null
  realField_gte?: Float | null
  realField_lt?: Float | null
  realField_lte?: Float | null
  realField_in?: Float[] | Float | null
  idField_eq?: ID_Input | null
  idField_in?: ID_Output[] | ID_Output | null
  intFieldDefault_eq?: Int | null
  intFieldDefault_gt?: Int | null
  intFieldDefault_gte?: Int | null
  intFieldDefault_lt?: Int | null
  intFieldDefault_lte?: Int | null
  intFieldDefault_in?: Int[] | Int | null
  smallIntField_eq?: Int | null
  smallIntField_gt?: Int | null
  smallIntField_gte?: Int | null
  smallIntField_lt?: Int | null
  smallIntField_lte?: Int | null
  smallIntField_in?: Int[] | Int | null
  bigIntField_eq?: Int | null
  bigIntField_gt?: Int | null
  bigIntField_gte?: Int | null
  bigIntField_lt?: Int | null
  bigIntField_lte?: Int | null
  bigIntField_in?: Int[] | Int | null
  jsonField_json?: JSONObject | null
  stringField_eq?: String | null
  stringField_contains?: String | null
  stringField_startsWith?: String | null
  stringField_endsWith?: String | null
  stringField_in?: String[] | String | null
  noSortField_eq?: String | null
  noSortField_contains?: String | null
  noSortField_startsWith?: String | null
  noSortField_endsWith?: String | null
  noSortField_in?: String[] | String | null
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
  charField_eq?: String | null
  charField_contains?: String | null
  charField_startsWith?: String | null
  charField_endsWith?: String | null
  charField_in?: String[] | String | null
  characterField_eq?: String | null
  characterField_contains?: String | null
  characterField_startsWith?: String | null
  characterField_endsWith?: String | null
  characterField_in?: String[] | String | null
  characterVaryingField_eq?: String | null
  characterVaryingField_contains?: String | null
  characterVaryingField_startsWith?: String | null
  characterVaryingField_endsWith?: String | null
  characterVaryingField_in?: String[] | String | null
  textField_eq?: String | null
  textField_contains?: String | null
  textField_startsWith?: String | null
  textField_endsWith?: String | null
  textField_in?: String[] | String | null
  varcharField_eq?: String | null
  varcharField_contains?: String | null
  varcharField_startsWith?: String | null
  varcharField_endsWith?: String | null
  varcharField_in?: String[] | String | null
  intField_eq?: Int | null
  intField_gt?: Int | null
  intField_gte?: Int | null
  intField_lt?: Int | null
  intField_lte?: Int | null
  intField_in?: Int[] | Int | null
  integerField_eq?: Int | null
  integerField_gt?: Int | null
  integerField_gte?: Int | null
  integerField_lt?: Int | null
  integerField_lte?: Int | null
  integerField_in?: Int[] | Int | null
  int2Field_eq?: Int | null
  int2Field_gt?: Int | null
  int2Field_gte?: Int | null
  int2Field_lt?: Int | null
  int2Field_lte?: Int | null
  int2Field_in?: Int[] | Int | null
  int4Field_eq?: Int | null
  int4Field_gt?: Int | null
  int4Field_gte?: Int | null
  int4Field_lt?: Int | null
  int4Field_lte?: Int | null
  int4Field_in?: Int[] | Int | null
  int8Field_eq?: Int | null
  int8Field_gt?: Int | null
  int8Field_gte?: Int | null
  int8Field_lt?: Int | null
  int8Field_lte?: Int | null
  int8Field_in?: Int[] | Int | null
  float4Field_eq?: Float | null
  float4Field_gt?: Float | null
  float4Field_gte?: Float | null
  float4Field_lt?: Float | null
  float4Field_lte?: Float | null
  float4Field_in?: Float[] | Float | null
  float8Field_eq?: Float | null
  float8Field_gt?: Float | null
  float8Field_gte?: Float | null
  float8Field_lt?: Float | null
  float8Field_lte?: Float | null
  float8Field_in?: Float[] | Float | null
  doublePrecisionField_eq?: Float | null
  doublePrecisionField_gt?: Float | null
  doublePrecisionField_gte?: Float | null
  doublePrecisionField_lt?: Float | null
  doublePrecisionField_lte?: Float | null
  doublePrecisionField_in?: Float[] | Float | null
  readonlyField_eq?: String | null
  readonlyField_contains?: String | null
  readonlyField_startsWith?: String | null
  readonlyField_endsWith?: String | null
  readonlyField_in?: String[] | String | null
}

export interface UserWhereUniqueInput {
  id?: ID_Input | null
  emailField?: String | null
  enumField?: StringEnum | null
  stringField?: String | null
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

export interface StandardDeleteResponse {
  id: ID_Output
}

export interface User extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  booleanField?: Boolean | null
  dateField?: DateTime | null
  emailField: String
  enumField?: StringEnum | null
  floatField?: Float | null
  realField?: Float | null
  idField?: String | null
  intFieldDefault?: Int | null
  smallIntField?: Int | null
  bigIntField?: Int | null
  jsonField?: JSONObject | null
  jsonFieldNoFilter?: JSONObject | null
  stringField?: String | null
  noFilterField?: String | null
  noSortField?: String | null
  noFilterOrSortField?: String | null
  numericField?: Float | null
  numericFieldCustomPrecisionScale?: Float | null
  charField?: String | null
  characterField?: String | null
  characterVaryingField?: String | null
  textField?: String | null
  varcharField?: String | null
  geometryField?: JSONObject | null
  intField?: Int | null
  integerField?: Int | null
  int2Field?: Int | null
  int4Field?: Int | null
  int8Field?: Int | null
  float4Field?: Float | null
  float8Field?: Float | null
  doublePrecisionField?: Float | null
  readonlyField?: String | null
}

/*
The `Boolean` scalar type represents `true` or `false`.
*/
export type Boolean = boolean

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