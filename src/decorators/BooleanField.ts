import { GraphQLBoolean } from 'graphql';
import { Field } from 'type-graphql';
import { Column } from 'typeorm';

import { decoratorDefaults } from '../metadata';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

import { WarthogField } from './WarthogField';

interface BooleanFieldOptions {
  default?: boolean;
  filter?: boolean;
  nullable?: boolean;
  sort?: boolean;
}

export function BooleanField(args: BooleanFieldOptions = {}): any {
  const options = { ...decoratorDefaults, ...args };
  const nullableOption = options.nullable === true ? { nullable: true } : {};
  const defaultOption =
    options.default === true || options.default === false ? { default: options.default } : {};

  const factories = [
    WarthogField('boolean', options),
    Field(() => GraphQLBoolean, {
      ...nullableOption,
      ...defaultOption
    }),
    Column({
      type: 'boolean',
      ...nullableOption,
      ...defaultOption
    }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
