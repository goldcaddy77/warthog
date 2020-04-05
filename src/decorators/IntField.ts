import { Int } from 'type-graphql';

import { DecoratorDefaults } from '../metadata';
import { composeMethodDecorators } from '../utils';
import { IntColumnType } from '../torm';

import { getCombinedDecorator } from './getCombinedDecorator';

interface IntFieldOptions extends DecoratorDefaults {
  dataType?: IntColumnType;
  default?: number;
}

export function IntField(options: IntFieldOptions = {}): any {
  const defaultOption = options.default ? { default: options.default } : {};
  const nullableOption = options.nullable === true ? { nullable: true } : {};

  const factories = getCombinedDecorator({
    fieldType: 'integer',
    warthogColumnMeta: options,
    gqlFieldType: Int,
    dbType: options.dataType ?? 'int',
    dbColumnOptions: { ...nullableOption, ...defaultOption }
  });

  return composeMethodDecorators(...factories);
}
