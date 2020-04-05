import { GraphQLISODateTime } from 'type-graphql';

import { DecoratorDefaults } from '../metadata';
import { ColumnType } from '../torm';
import { composeMethodDecorators } from '../utils';

import { getCombinedDecorator } from './getCombinedDecorator';

interface DateFieldOptions extends DecoratorDefaults {
  dataType?: ColumnType; // int16, jsonb, etc...
  default?: Date;
}

export function DateField(options: DateFieldOptions = {}): any {
  const nullableOption = options.nullable === true ? { nullable: true } : {};
  const defaultOption = options.default ? { default: options.default } : {};

  const factories = getCombinedDecorator({
    fieldType: 'date',
    warthogColumnMeta: options,
    gqlFieldType: GraphQLISODateTime,
    dbType: options.dataType || 'timestamp',
    dbColumnOptions: { ...nullableOption, ...defaultOption }
  });

  return composeMethodDecorators(...factories);
}
