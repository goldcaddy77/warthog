import { MaxLength, MinLength } from 'class-validator';

import { Field } from 'type-graphql';
import { Column } from 'typeorm';

import { FieldType, decoratorDefaults } from '../metadata';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';
import { StringColumnType } from '../torm';

import { WarthogField } from './WarthogField';

interface StringFieldOptions {
  dataType?: StringColumnType; // int16, jsonb, etc...
  maxLength?: number;
  minLength?: number;
  filter?: boolean | FieldType;
  nullable?: boolean;
  sort?: boolean;
  unique?: boolean;
  editable?: boolean;
}

export function StringField(args: StringFieldOptions = decoratorDefaults): any {
  const options = { ...decoratorDefaults, ...args };
  const nullableOption = options.nullable === true ? { nullable: true } : {};
  const maxLenOption = options.maxLength ? { length: options.maxLength } : {};
  const uniqueOption = options.unique ? { unique: true } : {};

  const factories = [
    WarthogField('string', options),
    // We explicitly say string here because when we're metaprogramming without
    // TS types, Field does not know that this should be a String
    Field(() => String, {
      ...nullableOption
    }),
    Column({
      type: args.dataType || 'varchar',
      ...maxLenOption,
      ...nullableOption,
      ...uniqueOption
    }) as MethodDecoratorFactory
  ];

  if (args.minLength) {
    factories.push(MinLength(args.minLength));
  }
  if (args.maxLength) {
    factories.push(MaxLength(args.maxLength));
  }

  return composeMethodDecorators(...factories);
}
