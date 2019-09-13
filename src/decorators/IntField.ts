import { Field, Int } from 'type-graphql';
import { Column } from 'typeorm';

import { getMetadataStorage } from '../metadata';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

interface IntFieldOptions {
  nullable?: boolean;
}

export function IntField(args: IntFieldOptions = {}): any {
  const nullableOption = args.nullable === true ? { nullable: true } : {};

  const registerWithWarthog = (target: object, propertyKey: string): any => {
    getMetadataStorage().addField('integer', target.constructor.name, propertyKey);
  };

  // These are the 2 required decorators to get type-graphql and typeorm working
  const factories = [
    registerWithWarthog,
    // We explicitly say string here because when we're metaprogramming without
    // TS types, Field does not know that this should be a String
    Field(() => Int, {
      ...nullableOption
    }),
    Column({
      type: 'int',
      ...nullableOption
    }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
