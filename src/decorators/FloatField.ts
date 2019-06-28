import { Field, Float } from 'type-graphql';
import { Container } from 'typedi';
import { Column } from 'typeorm';

import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';
import { defaultColumnType } from '../torm';

interface FloatFieldOptions {
  nullable?: boolean;
}

export function FloatField(args: FloatFieldOptions = {}): any {
  const nullableOption = args.nullable === true ? { nullable: true } : {};
  const databaseConnection: string = Container.get('warthog.db-connection');
  const type = defaultColumnType(databaseConnection, 'float');

  // These are the 2 required decorators to get type-graphql and typeorm working
  const factories = [
    Field(() => Float, {
      ...nullableOption
    }),
    Column({
      // This type will be different per database driver
      type,
      ...nullableOption
    }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
