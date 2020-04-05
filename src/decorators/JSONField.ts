// eslint-disable-next-line @typescript-eslint/no-var-requires
const { GraphQLJSONObject } = require('graphql-type-json');

import { decoratorDefaults } from '../metadata';
import { composeMethodDecorators } from '../utils';

import { getCombinedDecorator } from './getCombinedDecorator';

interface JSONFieldOptions {
  nullable?: boolean;
  filter?: boolean;
}

export function JSONField(args: JSONFieldOptions = {}): any {
  const options = { ...decoratorDefaults, ...args };

  const factories = getCombinedDecorator({
    fieldType: 'json',
    columnMetadata: options,
    gqlFieldType: GraphQLJSONObject,
    dbType: 'jsonb'
  });

  return composeMethodDecorators(...factories);
}
