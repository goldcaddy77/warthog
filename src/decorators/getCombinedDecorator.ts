import { Field } from 'type-graphql';
import { Column, ColumnType } from 'typeorm';

import { ColumnMetadata, FieldType } from '../metadata';
import { MethodDecoratorFactory } from '../utils';

import { WarthogField } from './WarthogField';

// Combine TypeORM, TypeGraphQL and Warthog decorators
export interface WarthogCombinedDecoratorOptions {
  fieldType: FieldType; // This is the warthog field type
  warthogColumnMeta: Partial<ColumnMetadata>; // Warthog options like sort, filter, nullable
  gqlFieldType?: any; // This is the Type that will land in the GraphQL schmea
  dbType?: ColumnType;
  dbColumnOptions?: any; // Passed to TypeORM `Column` decorator
}

//
export function getCombinedDecorator({
  fieldType,
  warthogColumnMeta,
  gqlFieldType = String,
  dbType = 'varchar',
  dbColumnOptions: columnOptions = {}
}: WarthogCombinedDecoratorOptions) {
  const nullableOption = warthogColumnMeta.nullable === true ? { nullable: true } : {};
  const defaultOption =
    typeof warthogColumnMeta.default !== 'undefined' ? { default: warthogColumnMeta.default } : {};
  const uniqueOption =
    typeof warthogColumnMeta.unique !== 'undefined' ? { unique: warthogColumnMeta.unique } : {};

  // Warthog: start with the Warthog decorator that adds metadata for generating the GraphQL schema
  // for sorting, filtering, args, where inputs, etc...
  const decorators = [WarthogField(fieldType, warthogColumnMeta)];

  // If an object is only writeable, don't add the `Field` decorators that will add it to the GraphQL type
  if (!warthogColumnMeta.writeonly) {
    // TypeGraphQL: next add the type-graphql decorator that generates the GraphQL type (or field within that type)
    decorators.push(
      Field(() => gqlFieldType, {
        ...nullableOption,
        ...defaultOption
      })
    );
  }

  // TypeORM: finally add the TypeORM decorator to describe the DB field
  decorators.push(
    Column({
      type: dbType,
      ...nullableOption,
      ...defaultOption,
      ...columnOptions,
      ...uniqueOption
    }) as MethodDecoratorFactory
  );

  return decorators;
}
