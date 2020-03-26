import { Field } from 'type-graphql';
import { Column, ColumnType } from 'typeorm';

import { ColumnMetadata, FieldType, decoratorDefaults } from '../metadata';
import { MethodDecoratorFactory } from '../utils';

import { WarthogField } from './WarthogField';

// Combine TypeORM, TypeGraphQL and Warthog decorators
export interface WarthogCombinedDecoratorOptions {
  fieldType: FieldType; // This is the warthog field type
  columnMetadata: Partial<ColumnMetadata>; // Warthog options like sort, filter, nullable
  gqlFieldType?: any; // This is the Type that will land in the GraphQL schmea
  dbType?: ColumnType;
  columnOptions?: any; // Passed to TypeORM `Column` decorator
}

//
export function getCombinedDecorator({
  fieldType,
  columnMetadata: decoratorOptions,
  gqlFieldType = String,
  dbType = 'varchar',
  columnOptions = {}
}: WarthogCombinedDecoratorOptions) {
  const options = { ...decoratorDefaults, ...decoratorOptions };
  const nullableOption = options.nullable === true ? { nullable: true } : {};
  const defaultOption = typeof options.default !== 'undefined' ? { default: options.default } : {};

  // Warthog: start with the Warthog decorator that adds metadata for generating the GraphQL schema
  // for sorting, filtering, args, where inputs, etc...
  const decorators = [WarthogField(fieldType, options)];

  // If an object is only writeable, don't add the `Field` decorators that will add it to the GraphQL type
  if (!options.writeonly) {
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
      ...columnOptions
    }) as MethodDecoratorFactory
  );

  return decorators;
}
