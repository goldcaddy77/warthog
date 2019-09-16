// eslint-disable-next-line @typescript-eslint/no-var-requires
const { GraphQLJSONObject } = require('graphql-type-json');

import { Field } from 'type-graphql';
import { Column } from 'typeorm';

import { decoratorDefaults, getMetadataStorage } from '../metadata';
import { defaultColumnType } from '../torm';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

interface JSONFieldOptions {
  nullable?: boolean;
}

export function JSONField(args: JSONFieldOptions = {}): any {
  const options = { ...decoratorDefaults, ...args };
  const databaseConnection: string = process.env.WARTHOG_DB_CONNECTION || '';
  const type = defaultColumnType(databaseConnection, 'json');

  const registerWithWarthog = (target: object, propertyKey: string): any => {
    getMetadataStorage().addField('json', target.constructor.name, propertyKey, options);
  };

  // These are the 2 required decorators to get type-graphql and typeorm working
  const factories = [
    registerWithWarthog,
    Field(() => GraphQLJSONObject, {
      ...options
    }),
    Column({
      type,
      ...options
    }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
