import { Field, GraphQLISODateTime } from 'type-graphql';
import { Column } from 'typeorm';

import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

interface DateFieldOptions {
  nullable?: boolean;
  default?: Date;
}

export function DateField(args: DateFieldOptions = {}): any {
  const nullableOption = args.nullable === true ? { nullable: true } : {};
  const defaultOption = args.default ? { default: args.default } : {};

  // These are the 2 required decorators to get type-graphql and typeorm working
  const factories = [
    // We explicitly say string here because when we're metaprogramming without
    // TS types, Field does not know that this should be a string
    Field(() => GraphQLISODateTime, {
      ...nullableOption
    }),
    Column({
      type: 'timestamp',
      ...nullableOption,
      ...defaultOption
    }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
