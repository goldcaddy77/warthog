import { MaxLength, MinLength } from 'class-validator';
import { Field } from 'type-graphql';
import { Column } from 'typeorm';

import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

interface StringFieldOptions {
  maxLength?: number;
  minLength?: number;
  nullable?: boolean;
  unique?: boolean;
  comment?: string; // TODO: GENERATOR: remove when we use metadata to do codegen
}

export function StringField(args: StringFieldOptions = {}): any {
  const nullableOption = args.nullable === true ? { nullable: true } : {};
  const maxLenOption = args.maxLength ? { length: args.maxLength } : {};
  const uniqueOption = args.unique ? { unique: true } : {};

  // TODO: GENERATOR: remove when we use metadata to do codegen
  const commentOption = args.comment ? { comment: args.comment } : {};

  // These are the 2 required decorators to get type-graphql and typeorm working
  const factories = [
    // We explicitly say string here because when we're metaprogramming without
    // TS types, Field does not know that this should be a String
    Field(() => String, {
      ...nullableOption
    }),
    Column({
      type: 'varchar',
      ...maxLenOption,
      ...nullableOption,
      ...uniqueOption,
      ...commentOption // TODO: GENERATOR: remove when we use metadata to do codegen
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
