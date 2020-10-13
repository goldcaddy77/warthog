import { Field } from '@nestjs/graphql';
import { ManyToMany as TypeORMManyToMany } from 'typeorm';

import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

export function ManyToMany(parentType: any, joinFunc: any, options: any = {}): any {
  const factories = [
    Field(() => [parentType()], { nullable: true, ...options }) as MethodDecoratorFactory,
    TypeORMManyToMany(parentType, joinFunc, options) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
