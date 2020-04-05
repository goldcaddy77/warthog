import { Float } from 'type-graphql';

import { decoratorDefaults, DecoratorDefaults } from '../metadata';
import { composeMethodDecorators } from '../utils';
import { FloatColumnType } from '../torm';

import { getCombinedDecorator } from './getCombinedDecorator';

interface FloatFieldOptions extends DecoratorDefaults {
  dataType?: FloatColumnType; // int16, jsonb, etc...
  default?: number;
}

export function FloatField(args: FloatFieldOptions = decoratorDefaults): any {
  const options = { ...decoratorDefaults, ...args };
  const nullableOption = options.nullable === true ? { nullable: true } : {};
  const defaultOption = options.default ? { default: options.default } : {};

  const factories = getCombinedDecorator({
    fieldType: 'float',
    columnMetadata: options,
    gqlFieldType: Float,
    dbType: args.dataType || 'float8',
    columnOptions: { ...nullableOption, ...defaultOption }
  });

  return composeMethodDecorators(...factories);
}
