// eslint-disable-next-line @typescript-eslint/no-var-requires
const { GraphQLJSONObject } = require('graphql-type-json');

import { Field } from 'type-graphql';
import { Column } from 'typeorm';

import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

import { defaultColumnType } from '../torm';

interface JSONFieldOptions {
  nullable?: boolean;
}

export function JSONField(args: JSONFieldOptions = {}): any {
  const nullableOption = args.nullable === true ? { nullable: true } : {};
  const databaseConnection: string = process.env.WARTHOG_DB_CONNECTION || '';
  const type = defaultColumnType(databaseConnection, 'json');

  // These are the 2 required decorators to get type-graphql and typeorm working
  const factories = [
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
