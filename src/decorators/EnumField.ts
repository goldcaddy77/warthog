const caller = require('caller');
import { Field, registerEnumType } from 'type-graphql';
import { Column } from 'typeorm';

import { getMetadataStorage } from '../metadata';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

interface EnumFieldOptions {
  nullable?: boolean;
}

export function EnumField(name: string, enumeration: object, options: EnumFieldOptions = {}): any {
  // Register enum with TypeGraphQL so that it lands in generated schema
  registerEnumType(enumeration, { name });

  // In order to use the enums in the generated classes file, we need to
  // save their locations and import them in the generated file
  const enumFileName = caller();

  const registerEnumWithWarthog = (target: any, propertyKey: string, descriptor: PropertyDescriptor): any => {
    getMetadataStorage().addEnum(target.constructor.name, propertyKey, name, enumeration, enumFileName);
  };

  const factories = [
    Field(type => enumeration, options),
    Column({ enum: enumeration, ...options }) as MethodDecoratorFactory,
    registerEnumWithWarthog
  ];

  return composeMethodDecorators(...factories);
}
