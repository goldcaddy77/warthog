import { Field, Float } from 'type-graphql';
import { Column, ColumnType } from 'typeorm';

import { decoratorDefaults, getMetadataStorage } from '../metadata';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';
import { defaultColumnType } from '../torm';

interface FloatFieldOptions {
  dataType?: ColumnType; // int16, jsonb, etc...
  filter?: boolean;
  nullable?: boolean;
  sort?: boolean;
}

export function FloatField(args: FloatFieldOptions = decoratorDefaults): any {
  const options = { ...decoratorDefaults, ...args };
  const nullableOption = options.nullable === true ? { nullable: true } : {};
  const databaseConnection: string = process.env.WARTHOG_DB_CONNECTION || '';
  const type = defaultColumnType(databaseConnection, 'float');

  const registerWithWarthog = (target: object, propertyKey: string): any => {
    getMetadataStorage().addField('float', target.constructor.name, propertyKey, options);
  };

  // These are the 2 required decorators to get type-graphql and typeorm working
  const factories = [
    registerWithWarthog,
    Field(() => Float, {
      ...nullableOption
    }),
    Column({
      // This type will be different per database driver
      type: args.dataType || type,
      ...nullableOption
    }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
