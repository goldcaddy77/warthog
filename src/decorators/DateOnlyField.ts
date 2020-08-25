// https://www.postgresql.org/docs/10/datatype-datetime.html
import { DateResolver } from 'graphql-scalars';

import { DecoratorCommonOptions } from '../metadata';
import { DateOnlyString } from '../core';
import { DateOnlyWhereOperator } from '../torm';
import { composeMethodDecorators } from '../utils';

import { getCombinedDecorator } from './getCombinedDecorator';

interface DateOnlyFieldOptions extends DecoratorCommonOptions {
  default?: DateOnlyString;
  filter?: boolean | DateOnlyWhereOperator[];
}

// V3: Update this to DateField
export function DateOnlyField(options: DateOnlyFieldOptions = {}): any {
  const nullableOption = options.nullable === true ? { nullable: true } : {};
  const defaultOption = options.default ? { default: options.default } : {};

  const factories = getCombinedDecorator({
    fieldType: 'dateonly',
    warthogColumnMeta: options,
    gqlFieldType: DateResolver,
    dbType: 'date',
    dbColumnOptions: { ...nullableOption, ...defaultOption }
  });

  return composeMethodDecorators(...factories);
}
