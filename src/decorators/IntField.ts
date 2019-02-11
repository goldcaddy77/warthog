import { Field, Int } from 'type-graphql';
import { Column } from 'typeorm';

import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

interface IntFieldOptions {
  nullable?: boolean;
}

export function IntField(args: IntFieldOptions = {}): any {
  const nullableOption = args.nullable === true ? { nullable: true } : {};

  // These are the 2 required decorators to get type-graphql and typeorm working
  const factories = [
    // We explicitly say string here because when we're metaprogramming without
    // TS types, Field does not know that this should be a String
    Field(type => Int, {
      ...nullableOption
    }),
    Column({
      type: 'int',
      ...nullableOption
    }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
