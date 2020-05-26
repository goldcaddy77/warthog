import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLScalarType,
  GraphQLString
} from 'graphql';
import { GraphQLISODateTime } from 'type-graphql';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { GraphQLJSONObject } = require('graphql-type-json');

import { FieldType } from '../metadata';

export function columnToGraphQLType(
  type: FieldType,
  enumName?: string
): GraphQLScalarType | string {
  if (typeof enumName !== undefined && enumName) {
    return String(enumName);
  }

  switch (type) {
    case 'id':
      return GraphQLID;
    case 'email':
    case 'string':
      return GraphQLString;
    case 'boolean':
      return GraphQLBoolean;
    case 'float':
      return GraphQLFloat;
    case 'numeric':
      return GraphQLString;
    case 'integer':
      return GraphQLInt;
    case 'date':
      return GraphQLISODateTime;
    // return GraphQLString; // V2: This should be GraphQLISODateTime
    case 'json':
      return GraphQLJSONObject;
    case 'enum':
      // This is to make TS happy and so that we'll get a compile time error if a new type is added
      throw new Error("Will never get here because it's handled above");
  }
}

export function columnTypeToGraphQLType(type: FieldType): GraphQLScalarType {
  switch (type) {
    case 'id':
      return GraphQLID;
    case 'email':
    case 'string':
      return GraphQLString;
    case 'boolean':
      return GraphQLBoolean;
    case 'float':
      return GraphQLFloat;
    case 'numeric':
      // Postgres nodejs driver use string for numeric type
      return GraphQLString;
    case 'integer':
      return GraphQLInt;
    case 'date':
      return GraphQLISODateTime;
    // return GraphQLString; // V2: This should be GraphQLISODateTime
    case 'json':
      return GraphQLJSONObject;
    case 'enum':
      // This is to make TS happy and so that we'll get a compile time error if a new type is added
      throw new Error("Will never get here because it's handled above");
  }
}

export function columnTypeToGraphQLDataType(type: FieldType, enumName?: string): string {
  const graphQLType = columnToGraphQLType(type, enumName);

  // Sometimes we want to return the full blow GraphQL data type, but sometimes we want to return
  // the more readable name.  Ex:
  // GraphQLInt -> Int
  // GraphQLJSONObject -> GraphQLJSONObject
  switch (graphQLType) {
    case GraphQLJSONObject:
      return 'GraphQLJSONObject';
    default:
      return typeof graphQLType === 'string' ? graphQLType : graphQLType.name;
  }
}

// const ID_TYPE = 'ID';
export function columnInfoToTypeScriptType(type: FieldType, enumName?: string): string {
  if (type === 'id') {
    return 'string'; // TODO: should this be ID_TYPE?
  } else if (enumName) {
    return String(enumName);
  } else if (type === 'numeric') {
    // postgres nodejs driver use string type or numeric type
    return 'string';
  } else {
    const graphqlType = columnTypeToGraphQLDataType(type, enumName);
    const typeMap: any = {
      Boolean: 'boolean',
      DateTime: 'Date',
      Float: 'number',
      GraphQLJSONObject: 'JsonObject',
      ID: 'string', // TODO: should this be ID_TYPE?
      Int: 'number',
      String: 'string'
    };

    return typeMap[graphqlType] || 'string';
  }
}
