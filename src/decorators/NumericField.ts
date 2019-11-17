import { Field, Float } from 'type-graphql';
import { Column } from 'typeorm';

import { decoratorDefaults } from '../metadata';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';
import { NumericColumnType } from '../torm';

import { WarthogField } from './WarthogField';

interface NumericFieldOptions {
  dataType?: NumericColumnType;
  filter?: boolean;
  nullable?: boolean;
  sort?: boolean;
  // TODO: allow passing of precision
}

export function NumericField(args: NumericFieldOptions = decoratorDefaults): any {
  const options = { ...decoratorDefaults, ...args };
  const nullableOption = options.nullable === true ? { nullable: true } : {};

  const factories = [
    WarthogField('numeric', options),
    Field(() => Float, {
      ...nullableOption
    }),
    Column({
      type: args.dataType || 'numeric',
      ...nullableOption
    }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
