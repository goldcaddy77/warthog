import { GraphQLBoolean } from 'graphql';
import { Field } from 'type-graphql';
import { Column } from 'typeorm';

import { getMetadataStorage } from '../metadata';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

interface BooleanFieldOptions {
  nullable?: boolean;
  default?: boolean;
}

export function BooleanField(args: BooleanFieldOptions = {}): any {
  const nullableOption = args.nullable === true ? { nullable: true } : {};
  const defaultOption = args.default ? { default: args.default } : {};

  const registerWithWarthog = (target: object, propertyKey: string): any => {
    getMetadataStorage().addField('boolean', target.constructor.name, propertyKey);
  };

  const factories = [
    registerWithWarthog,
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
