import { Float } from 'type-graphql';

import { DecoratorCommonOptions } from '../metadata';
import { composeMethodDecorators } from '../utils';
import { FloatColumnType } from '../torm';

import { getCombinedDecorator } from './getCombinedDecorator';

interface FloatFieldOptions extends DecoratorCommonOptions {
  dataType?: FloatColumnType; // int16, jsonb, etc...
  default?: number;
}

export function FloatField(options: FloatFieldOptions = {}): any {
  const nullableOption = options.nullable === true ? { nullable: true } : {};
  const defaultOption = options.default ? { default: options.default } : {};

  const factories = getCombinedDecorator({
    fieldType: 'float',
    warthogColumnMeta: options,
    gqlFieldType: Float,
    dbType: options.dataType ?? 'float8',
    dbColumnOptions: { ...nullableOption, ...defaultOption }
  });

  return composeMethodDecorators(...factories);
}
