import { MaxLength, MinLength } from 'class-validator';

import { decoratorDefaults, DecoratorDefaults } from '../metadata';
import { composeMethodDecorators } from '../utils';
import { StringColumnType } from '../torm';

import { getCombinedDecorator } from './getCombinedDecorator';

interface StringFieldOptions extends DecoratorDefaults {
  dataType?: StringColumnType; // int16, jsonb, etc...
  maxLength?: number;
  minLength?: number;
  default?: string;
  unique?: boolean;
}

export function StringField(args: StringFieldOptions = decoratorDefaults): any {
  const options = { ...decoratorDefaults, ...args };
  const maxLenOption = options.maxLength ? { length: options.maxLength } : {};
  const uniqueOption = options.unique ? { unique: true } : {};

  const factories = getCombinedDecorator({
    fieldType: 'string',
    columnMetadata: options,
    gqlFieldType: String,
    dbType: args.dataType || 'varchar',
    columnOptions: { ...maxLenOption, ...uniqueOption }
  });

  if (args.minLength) {
    factories.push(MinLength(args.minLength));
  }
  if (args.maxLength) {
    factories.push(MaxLength(args.maxLength));
  }

  return composeMethodDecorators(...factories);
}
