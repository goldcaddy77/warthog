import { GraphQLISODateTime } from 'type-graphql';

import { DecoratorCommonOptions } from '../metadata';
import { ColumnType, DateWhereOperator } from '../torm';
import { composeMethodDecorators } from '../utils';

import { getCombinedDecorator } from './getCombinedDecorator';

interface DateFieldOptions extends DecoratorCommonOptions {
  dataType?: ColumnType; // int16, jsonb, etc...
  default?: Date;
  filter?: boolean | DateWhereOperator[];
}

// V3: Deprecate this usage in favor of DateTimeField
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
