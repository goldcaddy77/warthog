import { GraphQLBoolean } from 'graphql';
import { Field } from 'type-graphql';
import { Column } from 'typeorm';

import { decoratorDefaults, getMetadataStorage } from '../metadata';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

interface BooleanFieldOptions {
  default?: boolean;
  filter?: boolean;
  nullable?: boolean;
  graphqlNullable?: boolean;
  sort?: boolean;
}

export function BooleanField(args: BooleanFieldOptions = {}): any {
  const options = { ...decoratorDefaults, ...args };
  const nullableOption = options.nullable === true ? { nullable: true } : {};
  const defaultOption = options.default ? { default: options.default } : {};

  const registerWithWarthog = (target: object, propertyKey: string): any => {
    getMetadataStorage().addField('boolean', target.constructor.name, propertyKey, options);
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
