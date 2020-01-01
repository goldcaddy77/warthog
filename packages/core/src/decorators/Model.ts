const caller = require('caller'); // eslint-disable-line @typescript-eslint/no-var-requires
import * as path from 'path';
import { ObjectType } from 'type-graphql';
import { ObjectOptions } from 'type-graphql/dist/decorators/ObjectType.d';
import { Entity, EntityOptions } from 'typeorm';

import { ClassType } from '../core';
import { getMetadataStorage } from '../metadata';
import { ClassDecoratorFactory, composeClassDecorators, generatedFolderPath } from '../utils/';

interface ModelOptions {
  api?: ObjectOptions | false;
  db?: EntityOptions | false;
}

// Allow default TypeORM and TypeGraphQL options to be used
export function Model({ api = {}, db = {} }: ModelOptions = {}) {
  // In order to use the enums in the generated classes file, we need to
  // save their locations and import them in the generated file
  const modelFileName = caller();

  // Use relative paths when linking source files so that we can check the generated code in
  // and it will work in any directory structure
  const relativeFilePath = path.relative(generatedFolderPath(), modelFileName);

  const registerModelWithWarthog = (target: ClassType): void => {
    // Save off where the model is located so that we can import it in the generated classes
    getMetadataStorage().addModel(target.name, target, relativeFilePath);
  };

  const factories = [];
  if (db !== false) {
    factories.push(Entity(db) as ClassDecoratorFactory);
  }
  if (api !== false) {
    factories.push(ObjectType(api) as ClassDecoratorFactory);
  }

  factories.push(registerModelWithWarthog as ClassDecoratorFactory);

  return composeClassDecorators(...factories);
}
