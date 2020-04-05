const caller = require('caller'); // eslint-disable-line @typescript-eslint/no-var-requires
import * as path from 'path';
import { Field, registerEnumType } from 'type-graphql';
import { Column } from 'typeorm';

import { decoratorDefaults, getMetadataStorage, DecoratorDefaults } from '../metadata';
import { composeMethodDecorators, generatedFolderPath, MethodDecoratorFactory } from '../utils';

interface EnumFieldOptions extends DecoratorDefaults {
  default?: any;
}

export function EnumField(
  name: string,
  enumeration: object,
  args: EnumFieldOptions = decoratorDefaults
): any {
  const options = { ...decoratorDefaults, ...args };

  // Register enum with TypeGraphQL so that it lands in generated schema
  registerEnumType(enumeration, { name });

  // In order to use the enums in the generated classes file, we need to
  // save their locations and import them in the generated file
  const decoratorSourceFile = caller();

  // Use relative paths in the source files so that they can be used on different machines
  const relativeFilePath = path.relative(generatedFolderPath(), decoratorSourceFile);

  const registerWithWarthog = (target: object, propertyKey: string): any => {
    getMetadataStorage().addEnum(
      target.constructor.name,
      propertyKey,
      name,
      enumeration,
      relativeFilePath,
      options
    );
  };

  const factories = [
    registerWithWarthog,
    Field(() => enumeration, options),
    Column({ enum: enumeration, ...options }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
