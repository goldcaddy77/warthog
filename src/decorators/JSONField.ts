// eslint-disable-next-line @typescript-eslint/no-var-requires
const { GraphQLJSONObject } = require('graphql-type-json');

import { composeMethodDecorators } from '../utils';
import { ClassType } from '../core/types';

import { getCombinedDecorator } from './getCombinedDecorator';

interface JSONFieldOptions {
  nullable?: boolean;
  filter?: boolean;
  gqlFieldType?: ClassType;
}

export function JSONField(options: JSONFieldOptions = {}): any {
  const factories = getCombinedDecorator({
    fieldType: 'json',
    warthogColumnMeta: options,
    gqlFieldType: options.gqlFieldType ?? GraphQLJSONObject,
    dbType: 'jsonb'
  });

  return composeMethodDecorators(...factories);
}
