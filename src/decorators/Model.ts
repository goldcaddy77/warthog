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
  apiOnly?: boolean;
  dbOnly?: boolean;
}

// Allow default TypeORM and TypeGraphQL options to be used
export function Model({ api = {}, db = {}, apiOnly = false, dbOnly = false }: ModelOptions = {}) {
  // In order to use the enums in the generated classes file, we need to
  // save their locations and import them in the generated file
  const modelFileName = caller();
  // V3: Remove these - they're here for backwards compatability so that we don't remove api: false and db: false
  if (api === false) {
    dbOnly = true;
  }
  if (db === false) {
    apiOnly = true;
  }

  const apiOnlyOption = apiOnly === true ? { apiOnly: true } : {};
  const dbOnlyOption = dbOnly === true ? { dbOnly: true } : {};

  // Use relative paths when linking source files so that we can check the generated code in
  // and it will work in any directory structure
  const relativeFilePath = path.relative(generatedFolderPath(), modelFileName);

  const registerModelWithWarthog = (target: ClassType): void => {
    // Save off where the model is located so that we can import it in the generated classes
    getMetadataStorage().addModel(target.name, target, relativeFilePath, {
      ...apiOnlyOption,
      ...dbOnlyOption
    });
  };

  const factories: any[] = [];
  if (!apiOnly) {
    factories.push(Entity(db as EntityOptions) as ClassDecoratorFactory);
  }

  // We add our own Warthog decorator regardless of dbOnly and apiOnly
  factories.push(registerModelWithWarthog as ClassDecoratorFactory);

  // We shouldn't add this as it creates the GraphQL type, but there is a
  // bug if we don't add it because we end up adding the Field decorators in the models
  factories.push(ObjectType(api as ObjectOptions) as ClassDecoratorFactory);

  return composeClassDecorators(...factories);
}
