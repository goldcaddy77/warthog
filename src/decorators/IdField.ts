import { DecoratorCommonOptions } from '../metadata';
import { IdWhereOperator } from '../torm';
import { composeMethodDecorators } from '../utils';

import { getCombinedDecorator } from './getCombinedDecorator';

interface IdFieldOptions extends DecoratorCommonOptions {
  unique?: boolean;
  filter?: boolean | IdWhereOperator[];
}

export function IdField(options: IdFieldOptions = {}): any {
  const nullableOption = options.nullable === true ? { nullable: true } : {};
  const uniqueOption = options.unique ? { unique: true } : {};

  const factories = getCombinedDecorator({
    fieldType: 'id',
    warthogColumnMeta: options,
    dbColumnOptions: { ...nullableOption, ...uniqueOption }
  });

  return composeMethodDecorators(...factories);
}
