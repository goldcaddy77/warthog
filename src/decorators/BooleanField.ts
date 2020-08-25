import { GraphQLBoolean } from 'graphql';

import { DecoratorCommonOptions } from '../metadata';
import { BooleanWhereOperator } from '../torm';
import { composeMethodDecorators } from '../utils';

import { getCombinedDecorator } from './getCombinedDecorator';

interface BooleanFieldOptions extends DecoratorCommonOptions {
  default?: boolean;
  filter?: boolean | BooleanWhereOperator[];
}

export function BooleanField(options: BooleanFieldOptions = {}): any {
  const factories = getCombinedDecorator({
    fieldType: 'boolean',
    warthogColumnMeta: options,
    gqlFieldType: GraphQLBoolean,
    dbType: 'boolean'
  });

  return composeMethodDecorators(...factories);
}
