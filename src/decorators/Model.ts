const caller = require('caller');
import { ObjectType } from 'type-graphql';
import { Entity } from 'typeorm';

import { getMetadataStorage } from '../metadata';
import { composeClassDecorators, ClassDecoratorFactory } from '../utils/';

interface ModelOptions {
  auditTableName?: string;
}

export function Model(this: any, args: ModelOptions = {}): any {
  const modelFileName = caller();

  const registerModelWithWarthog = (target: any): any => {
    // Save off where the model is located so that we can import it in the generated classes
    getMetadataStorage().addModel(target.name, target, modelFileName);
  };

  const factories = [
    Entity() as ClassDecoratorFactory,
    ObjectType() as ClassDecoratorFactory,
    registerModelWithWarthog as ClassDecoratorFactory
  ];

  return composeClassDecorators(...factories);
}
