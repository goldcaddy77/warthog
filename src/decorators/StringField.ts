import { MaxLength, MinLength } from 'class-validator';
import { Field } from 'type-graphql';
import { Column } from 'typeorm';

import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

interface StringFieldOptions {
  maxLength?: number;
  minLength?: number;
  nullable?: boolean;
  unique?: boolean;
}

export function StringField(args: StringFieldOptions = {}): any {
  const nullableOption = args.nullable === true ? { nullable: true } : {};
  const maxLenOption = args.maxLength ? { length: args.maxLength } : {};
  const uniqueOption = args.unique ? { unique: true } : {};

  // These are the 2 required decorators to get type-graphql and typeorm working
  const factories = [
    Field({ ...nullableOption }),
    Column({
      ...maxLenOption,
      ...nullableOption,
      ...uniqueOption
    }) as MethodDecoratorFactory
  ];

  // if (!args.nullable) {
  //   factories.push(IsDefined());
  // }
  if (args.minLength) {
    factories.push(MinLength(args.minLength));
  }
  if (args.maxLength) {
    factories.push(MaxLength(args.maxLength));
  }

  return composeMethodDecorators(...factories);
}
