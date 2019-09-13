import { IsEmail } from 'class-validator';
import { Field } from 'type-graphql';
import { Column } from 'typeorm';

import { getMetadataStorage } from '../metadata';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

interface EmailFieldOptions {
  nullable?: boolean;
  unique?: boolean;
}

export function EmailField(args: EmailFieldOptions = {}): any {
  const uniqueOption = args.unique === false ? {} : { unique: true }; // Default to unique
  const nullableOption = args.nullable === true ? { nullable: true } : {};

  const registerWithWarthog = (target: object, propertyKey: string): any => {
    getMetadataStorage().addField('email', target.constructor.name, propertyKey);
  };

  // These are the 2 required decorators to get type-graphql and typeorm working
  const factories = [
    registerWithWarthog,
    IsEmail(),
    Field(),
    Column({ ...uniqueOption, ...nullableOption }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
