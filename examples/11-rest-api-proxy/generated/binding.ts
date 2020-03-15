import { makeBindingClass, Options } from 'graphql-binding'
import { GraphQLResolveInfo, GraphQLSchema } from 'graphql'
import { IResolvers } from 'graphql-tools/dist/Interfaces'
import * as schema from  './schema.graphql'

export interface Query {
    cards: <T = Array<Card>>(args: { offset?: Int | null, limit?: Int | null, where?: CardWhereInput | null, orderBy?: CardOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    card: <T = Card>(args: { where: CardWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
  }

export interface Mutation {}

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

export const Binding = makeBindingClass<BindingConstructor<Binding>>({ schema })

/**
 * Types
*/

export type CardOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'name_ASC' |
  'name_DESC' |
  'nationalPokedexNumber_ASC' |
  'nationalPokedexNumber_DESC' |
  'types_ASC' |
  'types_DESC' |
  'subtype_ASC' |
  'subtype_DESC' |
  'supertype_ASC' |
  'supertype_DESC' |
  'hp_ASC' |
  'hp_DESC' |
  'number_ASC' |
  'number_DESC' |
  'artist_ASC' |
  'artist_DESC' |
  'rarity_ASC' |
  'rarity_DESC' |
  'series_ASC' |
  'series_DESC' |
  'set_ASC' |
  'set_DESC' |
  'setCode_ASC' |
  'setCode_DESC' |
  'retreatCost_ASC' |
  'retreatCost_DESC' |
  'convertedRetreatCost_ASC' |
  'convertedRetreatCost_DESC' |
  'text_ASC' |
  'text_DESC' |
  'attackDamage_ASC' |
  'attackDamage_DESC' |
  'attackCost_ASC' |
  'attackCost_DESC' |
  'attackName_ASC' |
  'attackName_DESC' |
  'attackText_ASC' |
  'attackText_DESC' |
  'weaknesses_ASC' |
  'weaknesses_DESC' |
  'resistances_ASC' |
  'resistances_DESC' |
  'ancientTrait_ASC' |
  'ancientTrait_DESC' |
  'abilityName_ASC' |
  'abilityName_DESC' |
  'abilityText_ASC' |
  'abilityText_DESC' |
  'abilityType_ASC' |
  'abilityType_DESC' |
  'evolvesFrom_ASC' |
  'evolvesFrom_DESC' |
  'contains_ASC' |
  'contains_DESC' |
  'imageUrl_ASC' |
  'imageUrl_DESC' |
  'imageUrlHiRes_ASC' |
  'imageUrlHiRes_DESC' |
  'ability_ASC' |
  'ability_DESC' |
  'attacks_ASC' |
  'attacks_DESC'

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

export interface CardCreateInput {
  name: String
  nationalPokedexNumber?: Float | null
  types?: String | null
  subtype?: String | null
  supertype?: String | null
  hp?: String | null
  number?: String | null
  artist?: String | null
  rarity?: String | null
  series?: String | null
  set?: String | null
  setCode?: String | null
  retreatCost?: String | null
  convertedRetreatCost?: String | null
  text?: String | null
  attackDamage?: String | null
  attackCost?: String | null
  attackName?: String | null
  attackText?: String | null
  weaknesses?: String | null
  resistances?: String | null
  ancientTrait?: String | null
  abilityName?: String | null
  abilityText?: String | null
  abilityType?: String | null
  evolvesFrom?: String | null
  contains?: String | null
  imageUrl?: String | null
  imageUrlHiRes?: String | null
  ability?: String | null
  attacks?: String | null
}

export interface CardUpdateInput {
  name?: String | null
  nationalPokedexNumber?: Float | null
  types?: String | null
  subtype?: String | null
  supertype?: String | null
  hp?: String | null
  number?: String | null
  artist?: String | null
  rarity?: String | null
  series?: String | null
  set?: String | null
  setCode?: String | null
  retreatCost?: String | null
  convertedRetreatCost?: String | null
  text?: String | null
  attackDamage?: String | null
  attackCost?: String | null
  attackName?: String | null
  attackText?: String | null
  weaknesses?: String | null
  resistances?: String | null
  ancientTrait?: String | null
  abilityName?: String | null
  abilityText?: String | null
  abilityType?: String | null
  evolvesFrom?: String | null
  contains?: String | null
  imageUrl?: String | null
  imageUrlHiRes?: String | null
  ability?: String | null
  attacks?: String | null
}

export interface CardWhereInput {
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
  name_eq?: String | null
  name_contains?: String | null
  name_startsWith?: String | null
  name_endsWith?: String | null
  name_in?: String[] | String | null
  nationalPokedexNumber_eq?: Int | null
  nationalPokedexNumber_gt?: Int | null
  nationalPokedexNumber_gte?: Int | null
  nationalPokedexNumber_lt?: Int | null
  nationalPokedexNumber_lte?: Int | null
  nationalPokedexNumber_in?: Int[] | Int | null
  types_eq?: String | null
  types_contains?: String | null
  types_startsWith?: String | null
  types_endsWith?: String | null
  types_in?: String[] | String | null
  subtype_eq?: String | null
  subtype_contains?: String | null
  subtype_startsWith?: String | null
  subtype_endsWith?: String | null
  subtype_in?: String[] | String | null
  supertype_eq?: String | null
  supertype_contains?: String | null
  supertype_startsWith?: String | null
  supertype_endsWith?: String | null
  supertype_in?: String[] | String | null
  hp_eq?: String | null
  hp_contains?: String | null
  hp_startsWith?: String | null
  hp_endsWith?: String | null
  hp_in?: String[] | String | null
  number_eq?: String | null
  number_contains?: String | null
  number_startsWith?: String | null
  number_endsWith?: String | null
  number_in?: String[] | String | null
  artist_eq?: String | null
  artist_contains?: String | null
  artist_startsWith?: String | null
  artist_endsWith?: String | null
  artist_in?: String[] | String | null
  rarity_eq?: String | null
  rarity_contains?: String | null
  rarity_startsWith?: String | null
  rarity_endsWith?: String | null
  rarity_in?: String[] | String | null
  series_eq?: String | null
  series_contains?: String | null
  series_startsWith?: String | null
  series_endsWith?: String | null
  series_in?: String[] | String | null
  set_eq?: String | null
  set_contains?: String | null
  set_startsWith?: String | null
  set_endsWith?: String | null
  set_in?: String[] | String | null
  setCode_eq?: String | null
  setCode_contains?: String | null
  setCode_startsWith?: String | null
  setCode_endsWith?: String | null
  setCode_in?: String[] | String | null
  retreatCost_eq?: String | null
  retreatCost_contains?: String | null
  retreatCost_startsWith?: String | null
  retreatCost_endsWith?: String | null
  retreatCost_in?: String[] | String | null
  convertedRetreatCost_eq?: String | null
  convertedRetreatCost_contains?: String | null
  convertedRetreatCost_startsWith?: String | null
  convertedRetreatCost_endsWith?: String | null
  convertedRetreatCost_in?: String[] | String | null
  text_eq?: String | null
  text_contains?: String | null
  text_startsWith?: String | null
  text_endsWith?: String | null
  text_in?: String[] | String | null
  attackDamage_eq?: String | null
  attackDamage_contains?: String | null
  attackDamage_startsWith?: String | null
  attackDamage_endsWith?: String | null
  attackDamage_in?: String[] | String | null
  attackCost_eq?: String | null
  attackCost_contains?: String | null
  attackCost_startsWith?: String | null
  attackCost_endsWith?: String | null
  attackCost_in?: String[] | String | null
  attackName_eq?: String | null
  attackName_contains?: String | null
  attackName_startsWith?: String | null
  attackName_endsWith?: String | null
  attackName_in?: String[] | String | null
  attackText_eq?: String | null
  attackText_contains?: String | null
  attackText_startsWith?: String | null
  attackText_endsWith?: String | null
  attackText_in?: String[] | String | null
  weaknesses_eq?: String | null
  weaknesses_contains?: String | null
  weaknesses_startsWith?: String | null
  weaknesses_endsWith?: String | null
  weaknesses_in?: String[] | String | null
  resistances_eq?: String | null
  resistances_contains?: String | null
  resistances_startsWith?: String | null
  resistances_endsWith?: String | null
  resistances_in?: String[] | String | null
  ancientTrait_eq?: String | null
  ancientTrait_contains?: String | null
  ancientTrait_startsWith?: String | null
  ancientTrait_endsWith?: String | null
  ancientTrait_in?: String[] | String | null
  abilityName_eq?: String | null
  abilityName_contains?: String | null
  abilityName_startsWith?: String | null
  abilityName_endsWith?: String | null
  abilityName_in?: String[] | String | null
  abilityText_eq?: String | null
  abilityText_contains?: String | null
  abilityText_startsWith?: String | null
  abilityText_endsWith?: String | null
  abilityText_in?: String[] | String | null
  abilityType_eq?: String | null
  abilityType_contains?: String | null
  abilityType_startsWith?: String | null
  abilityType_endsWith?: String | null
  abilityType_in?: String[] | String | null
  evolvesFrom_eq?: String | null
  evolvesFrom_contains?: String | null
  evolvesFrom_startsWith?: String | null
  evolvesFrom_endsWith?: String | null
  evolvesFrom_in?: String[] | String | null
  contains_eq?: String | null
  contains_contains?: String | null
  contains_startsWith?: String | null
  contains_endsWith?: String | null
  contains_in?: String[] | String | null
  imageUrl_eq?: String | null
  imageUrl_contains?: String | null
  imageUrl_startsWith?: String | null
  imageUrl_endsWith?: String | null
  imageUrl_in?: String[] | String | null
  imageUrlHiRes_eq?: String | null
  imageUrlHiRes_contains?: String | null
  imageUrlHiRes_startsWith?: String | null
  imageUrlHiRes_endsWith?: String | null
  imageUrlHiRes_in?: String[] | String | null
  ability_eq?: String | null
  ability_contains?: String | null
  ability_startsWith?: String | null
  ability_endsWith?: String | null
  ability_in?: String[] | String | null
  attacks_eq?: String | null
  attacks_contains?: String | null
  attacks_startsWith?: String | null
  attacks_endsWith?: String | null
  attacks_in?: String[] | String | null
}

export interface CardWhereUniqueInput {
  id: String
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

export interface Card extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  name: String
  nationalPokedexNumber?: Int | null
  types?: String | null
  subtype?: String | null
  supertype?: String | null
  hp?: String | null
  number?: String | null
  artist?: String | null
  rarity?: String | null
  series?: String | null
  set?: String | null
  setCode?: String | null
  retreatCost?: String | null
  convertedRetreatCost?: String | null
  text?: String | null
  attackDamage?: String | null
  attackCost?: String | null
  attackName?: String | null
  attackText?: String | null
  weaknesses?: String | null
  resistances?: String | null
  ancientTrait?: String | null
  abilityName?: String | null
  abilityText?: String | null
  abilityType?: String | null
  evolvesFrom?: String | null
  contains?: String | null
  imageUrl?: String | null
  imageUrlHiRes?: String | null
  ability?: String | null
  attacks?: String | null
}

export interface StandardDeleteResponse {
  id: ID_Output
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
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string