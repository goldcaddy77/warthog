import { decoratorDefaults, DecoratorDefaults } from '../metadata';
import { composeMethodDecorators } from '../utils';

import { getCombinedDecorator } from './getCombinedDecorator';

interface IdFieldOptions extends DecoratorDefaults {
  unique?: boolean;
}

export function IdField(args: IdFieldOptions = decoratorDefaults): any {
  const options = { ...decoratorDefaults, ...args };
  const nullableOption = options.nullable === true ? { nullable: true } : {};
  const uniqueOption = options.unique ? { unique: true } : {};

  const factories = getCombinedDecorator({
    fieldType: 'id',
    columnMetadata: options,
    columnOptions: { ...nullableOption, ...uniqueOption }
  });

  return composeMethodDecorators(...factories);
}
