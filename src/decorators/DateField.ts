import { Field, GraphQLISODateTime } from 'type-graphql';
import { Column } from 'typeorm';

import { getMetadataStorage } from '../metadata';
import { defaultColumnType } from '../torm';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

interface DateFieldOptions {
  nullable?: boolean;
  default?: Date;
}

export function DateField(args: DateFieldOptions = {}): any {
  const nullableOption = args.nullable === true ? { nullable: true } : {};
  const defaultOption = args.default ? { default: args.default } : {};
  const databaseConnection: string = process.env.WARTHOG_DB_CONNECTION || '';
  const type = defaultColumnType(databaseConnection, 'date');

  const registerWithWarthog = (target: object, propertyKey: string): any => {
    getMetadataStorage().addField('date', target.constructor.name, propertyKey);
  };

  // These are the 2 required decorators to get type-graphql and typeorm working
  const factories = [
    registerWithWarthog,
    Field(() => GraphQLISODateTime, {
      ...nullableOption
    }),
    Column({
      type,
      ...nullableOption,
      ...defaultOption
    }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
