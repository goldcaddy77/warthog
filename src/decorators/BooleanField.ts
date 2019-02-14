import { Field } from 'type-graphql';
import { Column } from 'typeorm';

import { GraphQLBoolean } from 'graphql';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

interface BooleanFieldOptions {
  nullable?: boolean;
}

export function BooleanField(args: BooleanFieldOptions = {}): any {
  const nullableOption = args.nullable === true ? { nullable: true } : {};

  // These are the 2 required decorators to get type-graphql and typeorm working
  const factories = [
    // We explicitly say string here because when we're metaprogramming without
    // TS types, Field does not know that this should be a String
    Field(type => GraphQLBoolean, {
      ...nullableOption
    }),
    Column({
      type: 'boolean',
      ...nullableOption
    }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
