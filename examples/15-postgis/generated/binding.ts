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

export type UserOrderByInput =   'geometryPoint_ASC' |
  'geometryPoint_DESC' |
  'geographyPoint_ASC' |
  'geographyPoint_DESC' |
  'createdAt_ASC' |
  'createdAt_DESC' |
  'createdById_ASC' |
  'createdById_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'updatedById_ASC' |
  'updatedById_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'deletedById_ASC' |
  'deletedById_DESC' |
  'version_ASC' |
  'version_DESC' |
  'ownerId_ASC' |
  'ownerId_DESC' |
  'id_ASC' |
  'id_DESC'

export interface LatLngInput {
  latitude: Float
  longitude: Float
}

export interface UserCreateInput {
  geometryPoint?: LatLngInput | null
  geographyPoint?: LatLngInput | null
  customGeometryPoint?: JSONObject | null
  customGeographyPoint?: JSONObject | null
}

export interface UserUpdateInput {
  geometryPoint?: LatLngInput | null
  geographyPoint?: LatLngInput | null
  customGeometryPoint?: JSONObject | null
  customGeographyPoint?: JSONObject | null
}

export interface UserWhereInput {
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
  version_eq?: Int | null
  version_gt?: Int | null
  version_gte?: Int | null
  version_lt?: Int | null
  version_lte?: Int | null
  version_in?: Int[] | Int | null
  ownerId_eq?: ID_Input | null
  ownerId_in?: ID_Output[] | ID_Output | null
  id_in?: ID_Output[] | ID_Output | null
}

export interface UserWhereUniqueInput {
  id: ID_Output
}

export interface DeleteResponse {
  id: ID_Output
}

export interface LatLng {
  latitude: Float
  longitude: Float
}

export interface PageInfo {
  hasNextPage: Boolean
  hasPreviousPage: Boolean
  startCursor?: String | null
  endCursor?: String | null
}

export interface StandardDeleteResponse {
  id: ID_Output
}

export interface User {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  geometryPoint?: LatLng | null
  geographyPoint?: LatLng | null
  customGeometryPoint?: JSONObject | null
  customGeographyPoint?: JSONObject | null
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