import { Field } from '@nestjs/graphql';
import { AdvancedOptions } from 'type-graphql/dist/decorators/types'; // https://github.com/MichalLytek/type-graphql/blob/3df214916af9e90c181509578eadf375672d87b0/src/decorators/types.ts
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
  const { type, filter, sort, ...typeGraphQLOptions } = args.api;
  const warthogOptions = { nullable: args.api.nullable, type, filter, sort, array: args.db.array };
  const graphQLType = args.db.array
    ? [columnTypeToGraphQLType(args.api.type)]
    : columnTypeToGraphQLType(args.api.type);

  // These are the 2 required decorators to get type-graphql and typeorm working
  const factories = [
    WarthogField(args.api.type, warthogOptions),
    Field(() => graphQLType, typeGraphQLOptions),
    Column(args.db) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
