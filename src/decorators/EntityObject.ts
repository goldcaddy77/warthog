import { ObjectType } from 'type-graphql';
import { Entity } from 'typeorm';

import { composeClassDecorators, ClassDecoratorFactory } from '../utils/';

interface EntityObjectOptions {
  auditTableName?: string;
}

export function EntityObject(this: any, args: EntityObjectOptions = {}): any {
  // const nullableOption = args.nullable === true ? { nullable: true } : {};
  // const maxLenOption = args.maxLength ? { length: args.maxLength } : {};
  // const uniqueOption = args.unique ? { unique: true } : {};

  // These are the 2 required decorators to get type-graphql and typeorm working
  // tslint:disable-next-line:class-name
  const factories = [Entity() as ClassDecoratorFactory, ObjectType() as ClassDecoratorFactory];

  return composeClassDecorators(...factories);
}
