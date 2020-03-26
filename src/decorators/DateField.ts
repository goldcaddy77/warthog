import { GraphQLISODateTime } from 'type-graphql';

import { decoratorDefaults, DecoratorDefaults } from '../metadata';
import { ColumnType } from '../torm';
import { composeMethodDecorators } from '../utils';

import { getCombinedDecorator } from './getCombinedDecorator';

interface DateFieldOptions extends DecoratorDefaults {
  dataType?: ColumnType; // int16, jsonb, etc...
  default?: Date;
}

export function DateField(args: DateFieldOptions = {}): any {
  const options = { ...decoratorDefaults, ...args };
  const nullableOption = options.nullable === true ? { nullable: true } : {};
  const defaultOption = options.default ? { default: options.default } : {};

  const factories = getCombinedDecorator({
    fieldType: 'date',
    columnMetadata: options,
    gqlFieldType: GraphQLISODateTime,
    dbType: args.dataType || 'timestamp',
    columnOptions: { ...nullableOption, ...defaultOption }
  });

  return composeMethodDecorators(...factories);
}
