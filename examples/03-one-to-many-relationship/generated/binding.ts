import 'graphql-import-node'; // Needed so you can import *.graphql files 

import { makeBindingClass, Options } from 'graphql-binding'
import { GraphQLResolveInfo, GraphQLSchema } from 'graphql'
import { IResolvers } from 'graphql-tools/dist/Interfaces'
import * as schema from  './schema.graphql'

export interface Query {
    posts: <T = Array<Post>>(args: { offset?: Int | null, limit?: Int | null, where?: PostWhereInput | null, orderBy?: PostOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    post: <T = Post>(args: { where: PostWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    users: <T = Array<User>>(args: { offset?: Int | null, limit?: Int | null, where?: UserWhereInput | null, orderBy?: UserOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    user: <T = User>(args: { where: UserWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
  }

export interface Mutation {
    createPost: <T = Post>(args: { data: PostCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updatePost: <T = Post>(args: { data: PostUpdateInput, where: PostWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deletePost: <T = StandardDeleteResponse>(args: { where: PostWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
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

export type PostOrderByInput =   'title_ASC' |
  'title_DESC' |
  'userId_ASC' |
  'userId_DESC' |
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

export type UserOrderByInput =   'firstName_ASC' |
  'firstName_DESC' |
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

export interface PostCreateInput {
  title: String
  userId: ID_Output
}

export interface PostUpdateInput {
  title?: String | null
  userId?: ID_Input | null
}

export interface PostWhereInput {
  title_eq?: String | null
  title_contains?: String | null
  title_startsWith?: String | null
  title_endsWith?: String | null
  title_in?: String[] | String | null
  userId_eq?: ID_Input | null
  userId_in?: ID_Output[] | ID_Output | null
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

export interface PostWhereUniqueInput {
  id: ID_Output
}

export interface UserCreateInput {
  firstName: String
}

export interface UserUpdateInput {
  firstName?: String | null
}

export interface UserWhereInput {
  firstName_eq?: String | null
  firstName_contains?: String | null
  firstName_startsWith?: String | null
  firstName_endsWith?: String | null
  firstName_in?: String[] | String | null
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

export interface PageInfo {
  hasNextPage: Boolean
  hasPreviousPage: Boolean
  startCursor?: String | null
  endCursor?: String | null
}

export interface Post {
  id: ID_Output
  createdAt: DateTime
  createdById: ID_Output
  updatedAt?: DateTime | null
  updatedById?: ID_Output | null
  deletedAt?: DateTime | null
  deletedById?: ID_Output | null
  version: Int
  ownerId: ID_Output
  title: String
  user: User
  userId: ID_Output
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
  firstName: String
  posts: Array<Post>
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
The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
*/
export type ID_Input = string | number
export type ID_Output = string

/*
The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
*/
export type Int = number

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string