// eslint-disable-next-line @typescript-eslint/no-var-requires
const { GraphQLJSONObject } = require('graphql-type-json');

import { composeMethodDecorators } from '../utils';

import { getCombinedDecorator } from './getCombinedDecorator';

interface JSONFieldOptions {
  nullable?: boolean;
  filter?: boolean;
}

export function JSONField(options: JSONFieldOptions = {}): any {
  const factories = getCombinedDecorator({
    fieldType: 'json',
    warthogColumnMeta: options,
    gqlFieldType: GraphQLJSONObject,
    dbType: 'jsonb'
  });

  return composeMethodDecorators(...factories);
}
