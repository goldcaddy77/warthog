import { IsEmail } from 'class-validator';
import { Field } from 'type-graphql';
import { Column } from 'typeorm';

import { decoratorDefaults, getMetadataStorage } from '../metadata';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

interface EmailFieldOptions {
  filter?: boolean;
  nullable?: boolean;
  sort?: boolean;
  unique?: boolean;
}

export function EmailField(args: EmailFieldOptions = {}): any {
  const options = { unique: true, ...decoratorDefaults, ...args };

  const registerWithWarthog = (target: object, propertyKey: string): any => {
    getMetadataStorage().addField('email', target.constructor.name, propertyKey, options);
  };

  const factories = [
    registerWithWarthog,
    IsEmail(),
    Field(),
    Column(options) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
