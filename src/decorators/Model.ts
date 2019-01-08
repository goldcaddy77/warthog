import { ObjectType } from 'type-graphql';
import { Entity } from 'typeorm';

import { composeClassDecorators, ClassDecoratorFactory } from '../utils/';

interface ModelOptions {
  auditTableName?: string;
}

export function Model(this: any, args: ModelOptions = {}): any {
  const factories = [Entity() as ClassDecoratorFactory, ObjectType() as ClassDecoratorFactory];

  return composeClassDecorators(...factories);
}
