const caller = require('caller'); // eslint-disable-line @typescript-eslint/no-var-requires
import * as path from 'path';
import { Field, registerEnumType } from 'type-graphql';
import { Column } from 'typeorm';
import { ClassType } from '../core';
import { DecoratorCommonOptions } from '../metadata';
import { EnumWhereOperator } from '../torm';
import { composeMethodDecorators, generatedFolderPath, MethodDecoratorFactory } from '../utils';

interface EnumFieldOptions extends DecoratorCommonOptions {
  default?: any;
  filter?: boolean | EnumWhereOperator[];
  array?: boolean;
}

export function EnumField(name: string, enumeration: object, options: EnumFieldOptions = {}): any {
  // Register enum with TypeGraphQL so that it lands in generated schema
  registerEnumType(enumeration, { name });

  // In order to use the enums in the generated classes file, we need to
  // save their locations and import them in the generated file
  const decoratorSourceFile = caller();

  // Use relative paths in the source files so that they can be used on different machines
  const relativeFilePath = path.relative(generatedFolderPath(), decoratorSourceFile);

  const registerWithWarthog = (target: ClassType, propertyKey: string): any => {
    Reflect.defineMetadata(
      `warthog:field:${propertyKey}`,
      {
        type: 'enum',
        propertyKey,
        name,
        enumeration,
        relativeFilePath,
        options
      },
      target.constructor // Access contructor instead of class instance
    );
  };

  // FIX THIS - SHOULD USE getCombinedDecorator
  const factories = [
    registerWithWarthog as MethodDecoratorFactory,
    Field(() => enumeration, options),
    Column({ enum: enumeration, ...options }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
