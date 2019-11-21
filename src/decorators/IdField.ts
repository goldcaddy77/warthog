import { Field } from 'type-graphql';
import { Column } from 'typeorm';

import { decoratorDefaults } from '../metadata';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

import { WarthogField } from './WarthogField';

interface StringFieldOptions {
  filter?: boolean;
  nullable?: boolean;
  sort?: boolean;
  unique?: boolean;
}

export function IdField(args: StringFieldOptions = decoratorDefaults): any {
  const options = { ...decoratorDefaults, ...args };
  const nullableOption = options.nullable === true ? { nullable: true } : {};
  const uniqueOption = options.unique ? { unique: true } : {};

  // These are the 2 required decorators to get type-graphql and typeorm working
  const factories = [
    WarthogField('id', options),
    // We explicitly say string here because when we're metaprogramming without
    // TS types, Field does not know that this should be a String
    Field(() => String, {
      ...nullableOption
    }),
    Column({
      type: 'varchar',
      ...nullableOption,
      ...uniqueOption
    }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
