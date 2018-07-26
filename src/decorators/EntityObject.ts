import { ObjectType } from 'type-graphql';
import { Entity } from 'typeorm';

import { composeClassDecorators, ClassDecoratorFactory } from '../utils/';

interface EntityObjectOptions {
  auditTableName?: string;
}

export function EntityObject(this: any, args: EntityObjectOptions = {}): any {
  const factories = [Entity() as ClassDecoratorFactory, ObjectType() as ClassDecoratorFactory];

  return composeClassDecorators(...factories);
}
