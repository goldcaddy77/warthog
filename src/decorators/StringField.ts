import { MaxLength, MinLength } from 'class-validator';
import { Field } from 'type-graphql';
import { Column } from 'typeorm';

import { getMetadataStorage } from '../metadata';
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

  const registerWithWarthog = (target: object, propertyKey: string): any => {
    getMetadataStorage().addField('string', target.constructor.name, propertyKey, args);
  };

  // These are the 2 required decorators to get type-graphql and typeorm working
  const factories = [
    registerWithWarthog,
    // We explicitly say string here because when we're metaprogramming without
    // TS types, Field does not know that this should be a String
    Field(() => String, {
      ...nullableOption
    }),
    Column({
      type: 'varchar',
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
