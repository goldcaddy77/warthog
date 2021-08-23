import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLScalarType,
  GraphQLString
} from 'graphql';
import { DateResolver } from 'graphql-scalars';
import { GraphQLISODateTime } from 'type-graphql';
import { ClassType } from '../core';
import { FieldType } from '../metadata';
import { LatLngInput } from '../tgql';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { GraphQLJSONObject } = require('graphql-type-json');

export function columnToGraphQLType(
  type: FieldType,
  enumName?: string
): GraphQLScalarType | string | ClassType {
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
    case 'numeric':
      return GraphQLFloat;
    case 'integer':
      return GraphQLInt;
    case 'date':
      return GraphQLISODateTime;
    case 'datetime':
      return GraphQLISODateTime;
    case 'dateonly':
      return DateResolver;
    case 'json':
      return GraphQLJSONObject;
    case 'lat-lng':
      return LatLngInput;
    case 'text':
      return GraphQLString;
    case 'enum':
      // This is to make TS happy and so that we'll get a compile time error if a new type is added
      throw new Error("Will never get here because it's handled above");
  }
}

export function columnTypeToGraphQLType(type: FieldType): GraphQLScalarType | ClassType {
  switch (type) {
    case 'id':
      return GraphQLID;
    case 'email':
    case 'string':
      return GraphQLString;
    case 'boolean':
      return GraphQLBoolean;
    case 'float':
    case 'numeric':
      return GraphQLFloat;
    case 'integer':
      return GraphQLInt;
    case 'date':
      return GraphQLISODateTime;
    case 'datetime':
      return GraphQLISODateTime;
    case 'dateonly':
      return DateResolver;
    case 'json':
      return GraphQLJSONObject;
    case 'lat-lng':
      return LatLngInput;
    case 'text':
      return GraphQLString;
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

export function columnInfoToTypeScriptType(type: FieldType, enumName?: string): string {
  if (type === 'id') {
    return 'string'; // TODO: should this be ID_TYPE?
  } else if (type === 'dateonly') {
    return 'DateOnlyString';
  } else if (type === 'datetime') {
    return 'DateTimeString';
  } else if (type === 'lat-lng') {
    return 'LatLng';
  } else if (enumName) {
    return String(enumName);
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
