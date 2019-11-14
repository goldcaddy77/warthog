import { Field, GraphQLISODateTime } from 'type-graphql';
import { Column, ColumnType } from 'typeorm';

import { decoratorDefaults, getMetadataStorage } from '../metadata';
import { defaultColumnType } from '../torm';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

interface DateFieldOptions {
  dataType?: ColumnType; // int16, jsonb, etc...
  default?: Date;
  filter?: boolean;
  nullable?: boolean;
  sort?: boolean;
}

export function DateField(args: DateFieldOptions = {}): any {
  const options = { ...decoratorDefaults, ...args };
  const nullableOption = options.nullable === true ? { nullable: true } : {};
  const defaultOption = options.default ? { default: options.default } : {};
  const databaseConnection: string = process.env.WARTHOG_DB_CONNECTION || '';
  const type = defaultColumnType(databaseConnection, 'date');

  const registerWithWarthog = (target: object, propertyKey: string): any => {
    getMetadataStorage().addField('date', target.constructor.name, propertyKey, options);
  };

  // These are the 2 required decorators to get type-graphql and typeorm working
  const factories = [
    registerWithWarthog,
    Field(() => GraphQLISODateTime, {
      ...nullableOption
    }),
    Column({
      type: args.dataType || type,
      ...nullableOption,
      ...defaultOption
    }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
