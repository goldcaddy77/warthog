import { MaxLength, MinLength } from 'class-validator';

import { DecoratorCommonOptions } from '../metadata';
import { composeMethodDecorators } from '../utils';
import { StringColumnType, StringWhereOperator } from '../torm';

import { getCombinedDecorator } from './getCombinedDecorator';

interface StringFieldOptions extends DecoratorCommonOptions {
  dataType?: StringColumnType; // int16, jsonb, etc...
  maxLength?: number;
  minLength?: number;
  default?: string;
  unique?: boolean;
  filter?: boolean | StringWhereOperator[];
  array?: boolean;
}

export function StringField(options: StringFieldOptions = {}): any {
  const maxLenOption = options.maxLength ? { length: options.maxLength } : {};
  const uniqueOption = options.unique ? { unique: true } : {};

  const factories = getCombinedDecorator<StringFieldOptions>({
    fieldType: 'string',
    warthogColumnMeta: options,
    gqlFieldType: String,
    dbType: options.dataType || 'varchar',
    dbColumnOptions: { ...maxLenOption, ...uniqueOption }
  });

  if (options.minLength) {
    factories.push(MinLength(options.minLength));
  }
  if (options.maxLength) {
    factories.push(MaxLength(options.maxLength));
  }

  return composeMethodDecorators(...factories);
}
