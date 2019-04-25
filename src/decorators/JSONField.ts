// tslint:disable-next-line:no-var-requires
const { GraphQLJSONObject } = require('graphql-type-json');

import { Field } from 'type-graphql';
import { Column } from 'typeorm';

import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

interface JSONFieldOptions {
  nullable?: boolean;
}

export function JSONField(args: JSONFieldOptions = {}): any {
  const nullableOption = args.nullable === true ? { nullable: true } : {};

  // These are the 2 required decorators to get type-graphql and typeorm working
  const factories = [
    Field(type => GraphQLJSONObject, {
      ...nullableOption
    }),
    Column({
      type: 'jsonb',
      ...nullableOption
    }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
