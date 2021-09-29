import { Field } from 'type-graphql';
import { ObjectType, OneToOne as TypeORMOneToOne, RelationOptions } from 'typeorm';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

export function OneToOne<T = any>(
  typeFunctionOrTarget: (type?: any) => ObjectType<T>,
  inverseSide?: string | ((object: T) => any),
  options?: RelationOptions
): any {
  const factories = [
    Field(typeFunctionOrTarget, options) as MethodDecoratorFactory,
    TypeORMOneToOne(typeFunctionOrTarget, inverseSide, options) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
