import { Field } from 'type-graphql';
import { AdvancedOptions } from 'type-graphql/dist/decorators/types';
import { Column, ColumnType } from 'typeorm';
import { ColumnOptions } from 'typeorm/decorator/options/ColumnOptions';

import { FieldType, DecoratorCommonOptions } from '../metadata';
import { columnTypeToGraphQLType } from '../schema';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';
import { WarthogField } from './WarthogField';

interface CustomColumnOptions extends ColumnOptions {
  type: ColumnType; // we require this
}

interface ExtendedTypeGraphQLOptions extends AdvancedOptions, DecoratorCommonOptions {
  type: FieldType;
  nullable?: boolean; // Hard code this: it exists in both AdvancedOptions and DecoratorDefaults, but they diverge
}

// Documentation: set to array type by setting db.array
interface CustomFieldOptions {
  // nullable?: boolean; // need to decide if we should add this shortcut
  api: ExtendedTypeGraphQLOptions;
  db: CustomColumnOptions;
}

export function CustomField(args: CustomFieldOptions): any {
  // const nullableOption = typeof args.nullable !== 'undefined' ? { nullable: args.nullable } : {};
  // const dbOptions = { ...nullableOption, ...(args.db || {}) };
  const {
    type,
    filter,
    sort,
    readonly,
    apiOnly,
    editable,
    dbOnly,
    writeonly,
    ...typeGraphQLOptions
  } = args.api;
  const warthogOptions: any = {
    nullable: args.api.nullable,
    type,
    filter,
    sort,
    array: args.db.array,
    readonly,
    apiOnly,
    editable,
    dbOnly,
    writeonly
  };
  const graphQLType = args.db.array
    ? [columnTypeToGraphQLType(args.api.type)]
    : columnTypeToGraphQLType(args.api.type);

  const factories: any[] = [];

  const exposeDB = dbOnly || !apiOnly;
  const exposeAPI = apiOnly || !dbOnly;

  // Warthog: start with the Warthog decorator that adds metadata for generating the GraphQL schema
  // for sorting, filtering, args, where inputs, etc...
  if (exposeAPI) {
    // filter out null and undefined from the list so they get proper defaults
    const filteredOptions: any = Object.entries(warthogOptions).reduce(
      (a: any, [k, v]) => (v == null ? a : ((a[k] = v), a)),
      {}
    );

    factories.push(WarthogField(type, filteredOptions));
  }

  // TypeGraphQL: next add the type-graphql decorator that generates the GraphQL type (or field within that type)
  // If an object is only writeable, don't add the `Field` decorators that will add it to the GraphQL type
  if (exposeAPI && !warthogOptions.writeonly) {
    factories.push(Field(() => graphQLType, typeGraphQLOptions));
  }

  // TypeORM: finally add the TypeORM decorator to describe the DB field
  if (exposeDB) {
    factories.push(Column(args.db) as MethodDecoratorFactory);
  }

  return composeMethodDecorators(...factories);
}
