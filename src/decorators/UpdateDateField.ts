import { Field, GraphQLISODateTime } from 'type-graphql';
import { UpdateDateColumn } from 'typeorm';

import { getMetadataStorage } from '../metadata';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

export function UpdateDateField(): any {
  const registerWithWarthog = (target: object, propertyKey: string): any => {
    getMetadataStorage().addField('date', target.constructor.name, propertyKey);
  };

  const factories = [
    registerWithWarthog,
    Field(() => GraphQLISODateTime, {
      nullable: true
    }),
    UpdateDateColumn({
      nullable: true
    }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
