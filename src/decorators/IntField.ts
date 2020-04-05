import { Int } from 'type-graphql';

import { decoratorDefaults, DecoratorDefaults } from '../metadata';
import { composeMethodDecorators } from '../utils';
import { IntColumnType } from '../torm';

import { getCombinedDecorator } from './getCombinedDecorator';

interface IntFieldOptions extends DecoratorDefaults {
  dataType?: IntColumnType;
  default?: number;
}

export function IntField(args: IntFieldOptions = decoratorDefaults): any {
  const options = { ...decoratorDefaults, ...args };
  const defaultOption = options.default ? { default: options.default } : {};
  const nullableOption = options.nullable === true ? { nullable: true } : {};

  const factories = getCombinedDecorator({
    fieldType: 'integer',
    columnMetadata: options,
    gqlFieldType: Int,
    dbType: args.dataType || 'int',
    columnOptions: { ...nullableOption, ...defaultOption }
  });

  return composeMethodDecorators(...factories);
}
