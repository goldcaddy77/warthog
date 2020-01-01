// eslint-disable-next-line @typescript-eslint/no-var-requires
const { GraphQLJSONObject } = require('graphql-type-json');

import { Field } from 'type-graphql';
import { Column } from 'typeorm';

import { decoratorDefaults } from '../metadata';
import { defaultColumnType } from '../torm';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

import { WarthogField } from './WarthogField';

interface JSONFieldOptions {
  nullable?: boolean;
}

export function JSONField(args: JSONFieldOptions = {}): any {
  const options = { ...decoratorDefaults, ...args };
  const databaseConnection: string = process.env.WARTHOG_DB_CONNECTION || '';
  const type = defaultColumnType(databaseConnection, 'json');

  // These are the 2 required decorators to get type-graphql and typeorm working
  const factories = [
    WarthogField('json', options),
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
