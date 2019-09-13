// eslint-disable-next-line @typescript-eslint/no-var-requires
const { GraphQLJSONObject } = require('graphql-type-json');

import { Field } from 'type-graphql';
import { Column } from 'typeorm';

import { getMetadataStorage } from '../metadata';
import { defaultColumnType } from '../torm';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

interface JSONFieldOptions {
  nullable?: boolean;
}

export function JSONField(args: JSONFieldOptions = {}): any {
  const nullableOption = args.nullable === true ? { nullable: true } : {};
  const databaseConnection: string = process.env.WARTHOG_DB_CONNECTION || '';
  const type = defaultColumnType(databaseConnection, 'json');

  const registerWithWarthog = (target: object, propertyKey: string): any => {
    getMetadataStorage().addField('json', target.constructor.name, propertyKey);
  };

  // These are the 2 required decorators to get type-graphql and typeorm working
  const factories = [
    registerWithWarthog,
    Field(() => GraphQLJSONObject, {
      ...nullableOption
    }),
    Column({
      type,
      ...nullableOption
    }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
