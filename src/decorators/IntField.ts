import { Int } from 'type-graphql';

import { DecoratorCommonOptions } from '../metadata';
import { IntColumnType, IntWhereOperator } from '../torm';
import { composeMethodDecorators } from '../utils';

import { getCombinedDecorator } from './getCombinedDecorator';

interface IntFieldOptions extends DecoratorCommonOptions {
  dataType?: IntColumnType;
  default?: number;
  filter?: boolean | IntWhereOperator[];
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
