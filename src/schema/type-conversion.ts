import { DateResolver } from 'graphql-scalars';
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

import { ColumnMetadata, FieldType } from '../metadata';

type GraphQLCustomType = any;

// TODO: need to figure out how to type a custom GraphQLField type
export function columnToGraphQLType(
  column: ColumnMetadata
): GraphQLScalarType | string | GraphQLCustomType {
  if (typeof column.enumName !== undefined && column.enumName) {
    return String(column.enumName);
  }

  if (column.type === 'json' && typeof column.gqlFieldType !== 'undefined') {
    return column.gqlFieldType;
  }

  return columnTypeToGraphQLType(column.type);
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
    case 'enum':
      // This is to make TS happy and so that we'll get a compile time error if a new type is added
      throw new Error("Will never get here because it's handled above");
  }
}

export function columnToGraphQLDataType(column: ColumnMetadata): string {
  const graphQLType = columnToGraphQLType(column);

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

export function columnToTypeScriptType(column: ColumnMetadata): string {
  // TODO: clean this up.  Ideally we'd deduce the TS type from the GraphQL type
  if (column.type === 'json' && typeof column.gqlFieldType !== 'undefined') {
    return column.gqlFieldType.name;
  }

  if (column.type === 'id') {
    return 'string'; // TODO: should this be ID_TYPE?
  } else if (column.type === 'dateonly') {
    return 'DateOnlyString';
  } else if (column.type === 'datetime') {
    return 'DateTimeString';
  } else if (column.enumName) {
    return String(column.enumName);
  } else {
    const graphqlType = columnToGraphQLDataType(column);
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
