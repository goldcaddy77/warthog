import { Field } from 'type-graphql';
import { AdvancedOptions } from 'type-graphql/dist/decorators/types';
import { Column, ColumnType } from 'typeorm';
import { ColumnOptions } from 'typeorm/decorator/options/ColumnOptions';

import { decoratorDefaults, FieldType, DecoratorDefaults } from '../metadata';
import { columnTypeToGraphQLType } from '../schema';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';
import { WarthogField } from './WarthogField';

interface CustomColumnOptions extends ColumnOptions {
  type: ColumnType; // we require this
}

interface ExtendedTypeGraphQLOptions extends AdvancedOptions, DecoratorDefaults {
  type: FieldType;
  nullable?: boolean; // Hard code this: it exists in both AdvancedOptions and DecoratorDefaults, but they diverge
}

interface CustomFieldOptions {
  // nullable?: boolean; // need to decide if we should add this shortcut
  api: ExtendedTypeGraphQLOptions;
  db: CustomColumnOptions;
}

export function CustomField(args: CustomFieldOptions): any {
  // const nullableOption = typeof args.nullable !== 'undefined' ? { nullable: args.nullable } : {};
  // const dbOptions = { ...nullableOption, ...(args.db || {}) };
  const { type, filter, sort, ...typeGraphQLOptions } = args.api;
  const warthogOptions = { ...decoratorDefaults, nullable: args.api.nullable, type, filter, sort };

  // These are the 2 required decorators to get type-graphql and typeorm working
  const factories = [
    WarthogField(args.api.type, warthogOptions),
    Field(() => columnTypeToGraphQLType(args.api.type), typeGraphQLOptions),
    Column(args.db) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
