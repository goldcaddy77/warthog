import { Field } from 'type-graphql';
import { JoinTable, ManyToMany as TypeORMManyToMany } from 'typeorm';

import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

export function ManyToManyJoin(parentType: any, joinFunc: any, options: any = {}): any {
  const factories = [
    JoinTable() as MethodDecoratorFactory,
    Field(() => [parentType()], { nullable: true, ...options }) as MethodDecoratorFactory,
    TypeORMManyToMany(parentType, joinFunc, options) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
