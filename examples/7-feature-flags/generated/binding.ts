import { makeBindingClass, Options } from 'graphql-binding'
import { GraphQLResolveInfo, GraphQLSchema } from 'graphql'
import { IResolvers } from 'graphql-tools/dist/Interfaces'
import * as schema from  './schema.graphql'

export interface Query {
    environments: <T = Array<Environment>>(args: { offset?: Int | null, limit?: Int | null, where?: EnvironmentWhereInput | null, orderBy?: EnvironmentOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    environment: <T = Environment>(args: { where: EnvironmentWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    featureFlagSegments: <T = Array<FeatureFlagSegment>>(args: { offset?: Int | null, limit?: Int | null, where?: FeatureFlagSegmentWhereInput | null, orderBy?: FeatureFlagSegmentOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    featureFlagSegment: <T = FeatureFlagSegment>(args: { where: FeatureFlagSegmentWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    featureFlagUsers: <T = Array<FeatureFlagUser>>(args: { offset?: Int | null, limit?: Int | null, where?: FeatureFlagUserWhereInput | null, orderBy?: FeatureFlagUserOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    featureFlagUser: <T = FeatureFlagUser>(args: { where: FeatureFlagUserWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    featureFlags: <T = Array<FeatureFlag>>(args: { offset?: Int | null, limit?: Int | null, where?: FeatureFlagWhereInput | null, orderBy?: FeatureFlagOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    featureFlagsForUser: <T = Array<String>>(args: { where: FeatureFlagsForUserInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    featureFlag: <T = FeatureFlag>(args: { where: FeatureFlagWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    projects: <T = Array<Project>>(args: { offset?: Int | null, limit?: Int | null, where?: ProjectWhereInput | null, orderBy?: ProjectOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    project: <T = Project>(args: { where: ProjectWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    segments: <T = Array<Segment>>(args: { offset?: Int | null, limit?: Int | null, where?: SegmentWhereInput | null, orderBy?: SegmentOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    segment: <T = Segment>(args: { where: SegmentWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    userSegments: <T = Array<UserSegment>>(args: { offset?: Int | null, limit?: Int | null, where?: UserSegmentWhereInput | null, orderBy?: UserSegmentOrderByInput | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    userSegment: <T = UserSegment>(args: { where: UserSegmentWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    user: <T = User>(args: { where: UserWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
  }

export interface Mutation {
    createEnvironment: <T = Environment>(args: { data: EnvironmentCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateEnvironment: <T = Environment>(args: { data: EnvironmentUpdateInput, where: EnvironmentWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteEnvironment: <T = StandardDeleteResponse>(args: { where: EnvironmentWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createFeatureFlagSegment: <T = FeatureFlagSegment>(args: { data: FeatureFlagSegmentCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateFeatureFlagSegment: <T = FeatureFlagSegment>(args: { data: FeatureFlagSegmentUpdateInput, where: FeatureFlagSegmentWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteFeatureFlagSegment: <T = StandardDeleteResponse>(args: { where: FeatureFlagSegmentWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createFeatureFlagUser: <T = FeatureFlagUser>(args: { data: FeatureFlagUserCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateFeatureFlagUser: <T = FeatureFlagUser>(args: { data: FeatureFlagUserUpdateInput, where: FeatureFlagUserWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteFeatureFlagUser: <T = StandardDeleteResponse>(args: { where: FeatureFlagUserWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createFeatureFlag: <T = FeatureFlag>(args: { data: FeatureFlagCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateFeatureFlag: <T = FeatureFlag>(args: { data: FeatureFlagUpdateInput, where: FeatureFlagWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteFeatureFlag: <T = StandardDeleteResponse>(args: { where: FeatureFlagWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createProject: <T = Project>(args: { data: ProjectCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateProject: <T = Project>(args: { data: ProjectUpdateInput, where: ProjectWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteProject: <T = StandardDeleteResponse>(args: { where: ProjectWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createSegment: <T = Segment>(args: { data: SegmentCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateSegment: <T = Segment>(args: { data: SegmentUpdateInput, where: SegmentWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteSegment: <T = StandardDeleteResponse>(args: { where: SegmentWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    createUserSegment: <T = UserSegment>(args: { data: UserSegmentCreateInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    updateUserSegment: <T = UserSegment>(args: { data: UserSegmentUpdateInput, where: UserSegmentWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    deleteUserSegment: <T = StandardDeleteResponse>(args: { where: UserSegmentWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
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

export const Binding = makeBindingClass<BindingConstructor<Binding>>({ schema })

/**
 * Types
*/

export type EnvironmentOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'name_ASC' |
  'name_DESC' |
  'key_ASC' |
  'key_DESC' |
  'projKey_ASC' |
  'projKey_DESC' |
  'projectId_ASC' |
  'projectId_DESC'

export type FeatureFlagOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'name_ASC' |
  'name_DESC' |
  'key_ASC' |
  'key_DESC' |
  'projKey_ASC' |
  'projKey_DESC' |
  'projectId_ASC' |
  'projectId_DESC'

export type FeatureFlagSegmentOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'projKey_ASC' |
  'projKey_DESC' |
  'projectId_ASC' |
  'projectId_DESC' |
  'envKey_ASC' |
  'envKey_DESC' |
  'environmentId_ASC' |
  'environmentId_DESC' |
  'featureKey_ASC' |
  'featureKey_DESC' |
  'featureFlagId_ASC' |
  'featureFlagId_DESC' |
  'segmentKey_ASC' |
  'segmentKey_DESC' |
  'segmentId_ASC' |
  'segmentId_DESC'

export type FeatureFlagUserOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'featureKey_ASC' |
  'featureKey_DESC' |
  'featureFlagId_ASC' |
  'featureFlagId_DESC' |
  'userKey_ASC' |
  'userKey_DESC' |
  'userId_ASC' |
  'userId_DESC' |
  'projKey_ASC' |
  'projKey_DESC' |
  'projectId_ASC' |
  'projectId_DESC' |
  'envKey_ASC' |
  'envKey_DESC' |
  'environmentId_ASC' |
  'environmentId_DESC'

export type ProjectOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'name_ASC' |
  'name_DESC' |
  'key_ASC' |
  'key_DESC'

export type SegmentOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'name_ASC' |
  'name_DESC' |
  'key_ASC' |
  'key_DESC' |
  'description_ASC' |
  'description_DESC' |
  'projKey_ASC' |
  'projKey_DESC' |
  'projectId_ASC' |
  'projectId_DESC' |
  'envKey_ASC' |
  'envKey_DESC' |
  'environmentId_ASC' |
  'environmentId_DESC'

export type UserSegmentOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'projKey_ASC' |
  'projKey_DESC' |
  'projectId_ASC' |
  'projectId_DESC' |
  'envKey_ASC' |
  'envKey_DESC' |
  'environmentId_ASC' |
  'environmentId_DESC' |
  'userKey_ASC' |
  'userKey_DESC' |
  'userId_ASC' |
  'userId_DESC' |
  'segmentKey_ASC' |
  'segmentKey_DESC' |
  'segmentId_ASC' |
  'segmentId_DESC'

export interface EnvironmentCreateInput {
  name: String
  key: String
  projKey: String
  projectId?: String | null
}

export interface EnvironmentUpdateInput {
  name?: String | null
  key?: String | null
  projKey?: String | null
  projectId?: String | null
}

export interface EnvironmentWhereInput {
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
  key_eq?: String | null
  key_contains?: String | null
  key_startsWith?: String | null
  key_endsWith?: String | null
  key_in?: String[] | String | null
  projKey_eq?: String | null
  projKey_contains?: String | null
  projKey_startsWith?: String | null
  projKey_endsWith?: String | null
  projKey_in?: String[] | String | null
  projectId_eq?: ID_Input | null
  projectId_in?: ID_Output[] | ID_Output | null
}

export interface EnvironmentWhereUniqueInput {
  id: String
}

export interface FeatureFlagCreateInput {
  name: String
  key: String
  projKey: String
  projectId?: String | null
}

export interface FeatureFlagSegmentCreateInput {
  projKey: String
  projectId?: String | null
  envKey: String
  environmentId?: String | null
  featureKey: String
  featureFlagId?: String | null
  segmentKey: String
  segmentId?: String | null
}

export interface FeatureFlagSegmentUpdateInput {
  projKey?: String | null
  projectId?: String | null
  envKey?: String | null
  environmentId?: String | null
  featureKey?: String | null
  featureFlagId?: String | null
  segmentKey?: String | null
  segmentId?: String | null
}

export interface FeatureFlagSegmentWhereInput {
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
  projKey_eq?: String | null
  projKey_contains?: String | null
  projKey_startsWith?: String | null
  projKey_endsWith?: String | null
  projKey_in?: String[] | String | null
  projectId_eq?: ID_Input | null
  projectId_in?: ID_Output[] | ID_Output | null
  envKey_eq?: String | null
  envKey_contains?: String | null
  envKey_startsWith?: String | null
  envKey_endsWith?: String | null
  envKey_in?: String[] | String | null
  environmentId_eq?: ID_Input | null
  environmentId_in?: ID_Output[] | ID_Output | null
  featureKey_eq?: String | null
  featureKey_contains?: String | null
  featureKey_startsWith?: String | null
  featureKey_endsWith?: String | null
  featureKey_in?: String[] | String | null
  featureFlagId_eq?: ID_Input | null
  featureFlagId_in?: ID_Output[] | ID_Output | null
  segmentKey_eq?: String | null
  segmentKey_contains?: String | null
  segmentKey_startsWith?: String | null
  segmentKey_endsWith?: String | null
  segmentKey_in?: String[] | String | null
  segmentId_eq?: ID_Input | null
  segmentId_in?: ID_Output[] | ID_Output | null
}

export interface FeatureFlagSegmentWhereUniqueInput {
  id: String
}

export interface FeatureFlagsForUserInput {
  projKey: String
  envKey: String
  userKey: String
}

export interface FeatureFlagUpdateInput {
  name?: String | null
  key?: String | null
  projKey?: String | null
  projectId?: String | null
}

export interface FeatureFlagUserCreateInput {
  featureKey: String
  featureFlagId?: String | null
  userKey: String
  userId?: String | null
  projKey: String
  projectId?: String | null
  envKey: String
  environmentId?: String | null
}

export interface FeatureFlagUserUpdateInput {
  featureKey?: String | null
  featureFlagId?: String | null
  userKey?: String | null
  userId?: String | null
  projKey?: String | null
  projectId?: String | null
  envKey?: String | null
  environmentId?: String | null
}

export interface FeatureFlagUserWhereInput {
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
  featureKey_eq?: String | null
  featureKey_contains?: String | null
  featureKey_startsWith?: String | null
  featureKey_endsWith?: String | null
  featureKey_in?: String[] | String | null
  featureFlagId_eq?: ID_Input | null
  featureFlagId_in?: ID_Output[] | ID_Output | null
  userKey_eq?: String | null
  userKey_contains?: String | null
  userKey_startsWith?: String | null
  userKey_endsWith?: String | null
  userKey_in?: String[] | String | null
  userId_eq?: ID_Input | null
  userId_in?: ID_Output[] | ID_Output | null
  projKey_eq?: String | null
  projKey_contains?: String | null
  projKey_startsWith?: String | null
  projKey_endsWith?: String | null
  projKey_in?: String[] | String | null
  projectId_eq?: ID_Input | null
  projectId_in?: ID_Output[] | ID_Output | null
  envKey_eq?: String | null
  envKey_contains?: String | null
  envKey_startsWith?: String | null
  envKey_endsWith?: String | null
  envKey_in?: String[] | String | null
  environmentId_eq?: ID_Input | null
  environmentId_in?: ID_Output[] | ID_Output | null
}

export interface FeatureFlagUserWhereUniqueInput {
  id: String
}

export interface FeatureFlagWhereInput {
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
  key_eq?: String | null
  key_contains?: String | null
  key_startsWith?: String | null
  key_endsWith?: String | null
  key_in?: String[] | String | null
  projKey_eq?: String | null
  projKey_contains?: String | null
  projKey_startsWith?: String | null
  projKey_endsWith?: String | null
  projKey_in?: String[] | String | null
  projectId_eq?: ID_Input | null
  projectId_in?: ID_Output[] | ID_Output | null
}

export interface FeatureFlagWhereUniqueInput {
  id: String
}

export interface ProjectCreateInput {
  name: String
  key: String
}

export interface ProjectUpdateInput {
  name?: String | null
  key?: String | null
}

export interface ProjectWhereInput {
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
  key_eq?: String | null
  key_contains?: String | null
  key_startsWith?: String | null
  key_endsWith?: String | null
  key_in?: String[] | String | null
}

export interface ProjectWhereUniqueInput {
  id?: String | null
  key?: String | null
}

export interface SegmentCreateInput {
  name: String
  key: String
  description: String
  projKey: String
  projectId?: String | null
  envKey: String
  environmentId?: String | null
}

export interface SegmentUpdateInput {
  name?: String | null
  key?: String | null
  description?: String | null
  projKey?: String | null
  projectId?: String | null
  envKey?: String | null
  environmentId?: String | null
}

export interface SegmentWhereInput {
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
  key_eq?: String | null
  key_contains?: String | null
  key_startsWith?: String | null
  key_endsWith?: String | null
  key_in?: String[] | String | null
  description_eq?: String | null
  description_contains?: String | null
  description_startsWith?: String | null
  description_endsWith?: String | null
  description_in?: String[] | String | null
  projKey_eq?: String | null
  projKey_contains?: String | null
  projKey_startsWith?: String | null
  projKey_endsWith?: String | null
  projKey_in?: String[] | String | null
  projectId_eq?: ID_Input | null
  projectId_in?: ID_Output[] | ID_Output | null
  envKey_eq?: String | null
  envKey_contains?: String | null
  envKey_startsWith?: String | null
  envKey_endsWith?: String | null
  envKey_in?: String[] | String | null
  environmentId_eq?: ID_Input | null
  environmentId_in?: ID_Output[] | ID_Output | null
}

export interface SegmentWhereUniqueInput {
  id: String
}

export interface UserSegmentCreateInput {
  projKey: String
  projectId?: String | null
  envKey: String
  environmentId?: String | null
  userKey: String
  userId?: String | null
  segmentKey: String
  segmentId?: String | null
}

export interface UserSegmentUpdateInput {
  projKey?: String | null
  projectId?: String | null
  envKey?: String | null
  environmentId?: String | null
  userKey?: String | null
  userId?: String | null
  segmentKey?: String | null
  segmentId?: String | null
}

export interface UserSegmentWhereInput {
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
  projKey_eq?: String | null
  projKey_contains?: String | null
  projKey_startsWith?: String | null
  projKey_endsWith?: String | null
  projKey_in?: String[] | String | null
  projectId_eq?: ID_Input | null
  projectId_in?: ID_Output[] | ID_Output | null
  envKey_eq?: String | null
  envKey_contains?: String | null
  envKey_startsWith?: String | null
  envKey_endsWith?: String | null
  envKey_in?: String[] | String | null
  environmentId_eq?: ID_Input | null
  environmentId_in?: ID_Output[] | ID_Output | null
  userKey_eq?: String | null
  userKey_contains?: String | null
  userKey_startsWith?: String | null
  userKey_endsWith?: String | null
  userKey_in?: String[] | String | null
  userId_eq?: ID_Input | null
  userId_in?: ID_Output[] | ID_Output | null
  segmentKey_eq?: String | null
  segmentKey_contains?: String | null
  segmentKey_startsWith?: String | null
  segmentKey_endsWith?: String | null
  segmentKey_in?: String[] | String | null
  segmentId_eq?: ID_Input | null
  segmentId_in?: ID_Output[] | ID_Output | null
}

export interface UserSegmentWhereUniqueInput {
  id: String
}

export interface UserWhereUniqueInput {
  id?: String | null
  key?: String | null
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

export interface Environment extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  name: String
  key: String
  projKey: String
  projectId?: String | null
  segments?: Array<Segment> | null
  featureFlagUsers?: Array<FeatureFlagUser> | null
  featureFlagSegments?: Array<FeatureFlagSegment> | null
  userSegments?: Array<UserSegment> | null
  project: Project
}

export interface FeatureFlag extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  name: String
  key: String
  projKey: String
  projectId?: String | null
  featureFlagUsers?: Array<FeatureFlagUser> | null
  featureFlagSegments?: Array<FeatureFlagSegment> | null
  project: Project
}

export interface FeatureFlagSegment extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  projKey: String
  projectId?: String | null
  envKey: String
  environmentId?: String | null
  featureKey: String
  featureFlagId?: String | null
  segmentKey: String
  segmentId?: String | null
}

export interface FeatureFlagUser extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  featureKey: String
  featureFlagId?: String | null
  userKey: String
  userId?: String | null
  projKey: String
  projectId?: String | null
  envKey: String
  environmentId?: String | null
  user: User
}

export interface Project extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  name: String
  key: String
  environments?: Array<Environment> | null
  segments?: Array<Segment> | null
  featureFlags?: Array<FeatureFlag> | null
  featureFlagUsers?: Array<FeatureFlagUser> | null
  featureFlagSegments?: Array<FeatureFlagSegment> | null
  userSegments?: Array<UserSegment> | null
}

export interface Segment extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  name: String
  key: String
  description: String
  projKey: String
  projectId?: String | null
  envKey: String
  environmentId?: String | null
  featureFlagSegments?: Array<FeatureFlagSegment> | null
  userSegments?: Array<UserSegment> | null
  environment: Environment
  project: Project
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
  key: String
  featureFlagUsers?: Array<FeatureFlagUser> | null
  userSegments?: Array<UserSegment> | null
}

export interface UserSegment extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  projKey: String
  projectId?: String | null
  envKey: String
  environmentId?: String | null
  userKey: String
  userId?: String | null
  segmentKey: String
  segmentId?: String | null
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