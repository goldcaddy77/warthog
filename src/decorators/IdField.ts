import { DecoratorCommonOptions } from '../metadata';
import { composeMethodDecorators } from '../utils';

import { getCombinedDecorator } from './getCombinedDecorator';

interface IdFieldOptions extends DecoratorCommonOptions {
  unique?: boolean;
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
