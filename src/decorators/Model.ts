const caller = require('caller'); // eslint-disable-line @typescript-eslint/no-var-requires
import * as path from 'path';
import { ObjectType } from 'type-graphql';
import { Entity } from 'typeorm';

import { getMetadataStorage } from '../metadata';
import { ClassDecoratorFactory, composeClassDecorators, generatedFolderPath } from '../utils/';

interface ModelOptions {
  auditTableName?: string;
}

export function Model(this: any, args: ModelOptions = {}): any {
  // In order to use the enums in the generated classes file, we need to
  // save their locations and import them in the generated file
  const modelFileName = caller();

  // Use relative paths in the source files so that they can be used on different machines
  const relativeFilePath = path.relative(generatedFolderPath(), modelFileName);

  const registerModelWithWarthog = (target: any): any => {
    // Save off where the model is located so that we can import it in the generated classes
    getMetadataStorage().addModel(target.name, target, relativeFilePath);
  };

  const factories = [
    Entity() as ClassDecoratorFactory,
    ObjectType() as ClassDecoratorFactory,
    registerModelWithWarthog as ClassDecoratorFactory
  ];

  return composeClassDecorators(...factories);
}
