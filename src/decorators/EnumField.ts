const caller = require('caller'); // eslint-disable-line @typescript-eslint/no-var-requires
import * as path from 'path';
import { Field, registerEnumType } from 'type-graphql';
import { Column } from 'typeorm';

import { getMetadataStorage } from '../metadata';
import { composeMethodDecorators, generatedFolderPath, MethodDecoratorFactory } from '../utils';

interface EnumFieldOptions {
  nullable?: boolean;
  default?: any;
}

export function EnumField(name: string, enumeration: object, options: EnumFieldOptions = {}): any {
  // Register enum with TypeGraphQL so that it lands in generated schema
  registerEnumType(enumeration, { name });

  // In order to use the enums in the generated classes file, we need to
  // save their locations and import them in the generated file
  const decoratorSourceFile = caller();

  // Use relative paths in the source files so that they can be used on different machines
  const relativeFilePath = path.relative(generatedFolderPath(), decoratorSourceFile);

  const registerEnumWithWarthog = (target: object, propertyKey: string): any => {
    getMetadataStorage().addEnum(
      target.constructor.name,
      propertyKey,
      name,
      enumeration,
      relativeFilePath
    );
  };

  const factories = [
    registerEnumWithWarthog,
    Field(() => enumeration, options),
    Column({ enum: enumeration, ...options }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
