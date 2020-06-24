import { Field } from 'type-graphql';
import { OneToOne as TypeORMOneToOne } from 'typeorm';

import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

export function OneToOne(parentType: any, options: any = {}): any {
  const factories = [
    Field(parentType, { nullable: true, ...options }) as MethodDecoratorFactory,
    TypeORMOneToOne(parentType, options) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
