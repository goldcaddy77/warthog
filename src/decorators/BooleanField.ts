import { GraphQLBoolean } from 'graphql';

import { DecoratorDefaults } from '../metadata';
import { composeMethodDecorators } from '../utils';

import { getCombinedDecorator } from './getCombinedDecorator';

interface BooleanFieldOptions extends DecoratorDefaults {
  default?: boolean;
}

export function BooleanField(options: BooleanFieldOptions = {}): any {
  const factories = getCombinedDecorator({
    fieldType: 'boolean',
    columnMetadata: options,
    gqlFieldType: GraphQLBoolean,
    dbType: 'boolean'
  });

  return composeMethodDecorators(...factories);
}
