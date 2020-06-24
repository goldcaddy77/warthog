import { Field } from 'type-graphql';
import { OneToOne as TypeORMOneToOne, JoinColumn } from 'typeorm';

import { IdField } from '.';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

// To be used in model.ejs
export { JoinColumn };

export function OneToOneJoin(parentType: any, options: any = {}): any {
  // Need to grab the class name from within a decorator
  let klass: string;
  const extractClassName = (target: any): any => {
    klass = target.constructor.name;
  };

  // This Decorator creates the foreign key field for the association so that the consumer
  // Doesn't need to hand roll this each time by doing somethign like:
  // @StringField()
  // userId?: ID;
  const createForeignKeyField = (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): any => {
    klass = target.constructor.name;
    Reflect.defineProperty(target, `${klass}Id`, {});
    IdField(options)(target, `${propertyKey}Id`, descriptor);
  };

  // NOTE: this is unnecessary, but I'm keeping it around because otherwise it will generate the schema properties in a different order
  // It could otherwise safely be deleted
  const graphQLdecorator = [
    Field(parentType, { nullable: true, ...options }) as MethodDecoratorFactory
  ];
  // END NOTE
  const factories = [
    extractClassName,
    ...graphQLdecorator,
    TypeORMOneToOne(parentType, options) as MethodDecoratorFactory,
    JoinColumn() as MethodDecoratorFactory,
    createForeignKeyField
  ];

  return composeMethodDecorators(...factories);
}
