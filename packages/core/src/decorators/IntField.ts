import { Field, Int } from 'type-graphql';
import { Column } from 'typeorm';

import { decoratorDefaults } from '../metadata';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';
import { IntColumnType } from '../torm';

import { WarthogField } from './WarthogField';

interface IntFieldOptions {
  dataType?: IntColumnType;
  default?: number;
  filter?: boolean;
  nullable?: boolean;
  sort?: boolean;
}

export function IntField(args: IntFieldOptions = decoratorDefaults): any {
  const options = { ...decoratorDefaults, ...args };
  const defaultOption = options.default ? { default: options.default } : {};
  const nullableOption = options.nullable === true ? { nullable: true } : {};

  const factories = [
    WarthogField('integer', options),
    Field(() => Int, {
      ...nullableOption
    }),
    Column({
      type: args.dataType || 'int',
      ...nullableOption,
      ...defaultOption
    }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
