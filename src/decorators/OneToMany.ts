import { Field } from 'type-graphql';
import { OneToMany as TypeORMOneToMany } from 'typeorm';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

export function OneToMany(parentType: any, joinFunc: any, options: any = {}): any {
  const factories = [
    Field(parentType, { ...options }) as MethodDecoratorFactory,
    TypeORMOneToMany(parentType, joinFunc) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
