import { Field, Float } from 'type-graphql';
import { Column } from 'typeorm';

import { decoratorDefaults } from '../metadata';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';
import { FloatColumnType, defaultColumnType } from '../torm';

import { WarthogField } from './WarthogField';

interface FloatFieldOptions {
  dataType?: FloatColumnType; // int16, jsonb, etc...
  default?: number;
  filter?: boolean;
  nullable?: boolean;
  sort?: boolean;
}

export function FloatField(args: FloatFieldOptions = decoratorDefaults): any {
  const options = { ...decoratorDefaults, ...args };
  const nullableOption = options.nullable === true ? { nullable: true } : {};
  const defaultOption = options.default ? { default: options.default } : {};
  const databaseConnection: string = process.env.WARTHOG_DB_CONNECTION || '';
  const type = defaultColumnType(databaseConnection, 'float');

  const factories = [
    WarthogField('float', options),
    Field(() => Float, {
      ...nullableOption
    }),
    Column({
      // This type will be different per database driver
      type: args.dataType || type,
      ...nullableOption,
      ...defaultOption
    }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
