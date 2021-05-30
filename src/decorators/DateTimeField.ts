// https://www.postgresql.org/docs/10/datatype-datetime.html
import { GraphQLISODateTime } from 'type-graphql';
import { DateTimeString } from '../core';
import { DecoratorCommonOptions } from '../metadata';
import { DateTimeWhereOperator } from '../torm';
import { composeMethodDecorators } from '../utils';
import { getCombinedDecorator } from './getCombinedDecorator';

interface DateTimeFieldOptions extends DecoratorCommonOptions {
  default?: DateTimeString;
  filter?: boolean | DateTimeWhereOperator[];
}

// V3: Deprecate this usage in favor of DateTimeField
export function DateTimeField(options: DateTimeFieldOptions = {}): any {
  const nullableOption = options.nullable === true ? { nullable: true } : {};
  const defaultOption = options.default ? { default: options.default } : {};

  const factories = getCombinedDecorator({
    fieldType: 'datetime',
    warthogColumnMeta: options,
    gqlFieldType: GraphQLISODateTime,
    dbType: 'timestamptz',
    dbColumnOptions: { ...nullableOption, ...defaultOption }
  });

  return composeMethodDecorators(...factories);
}
