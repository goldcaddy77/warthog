import { GraphQLBoolean } from 'graphql';

import { DecoratorCommonOptions } from '../metadata';
import { composeMethodDecorators } from '../utils';

import { getCombinedDecorator } from './getCombinedDecorator';

interface BooleanFieldOptions extends DecoratorCommonOptions {
  default?: boolean;
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
