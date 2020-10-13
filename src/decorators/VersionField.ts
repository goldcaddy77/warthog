import { Int } from '@nestjs/graphql';
import { VersionColumn } from 'typeorm';

import { DecoratorCommonOptions } from '../metadata';
import { IntWhereOperator } from '../torm';
import { composeMethodDecorators } from '../utils';
import { getCombinedDecorator } from './getCombinedDecorator';

interface VersionFieldOptions extends DecoratorCommonOptions {
  filter?: boolean | IntWhereOperator[];
}

export function VersionField(options: VersionFieldOptions = {}): any {
  const factories = getCombinedDecorator({
    fieldType: 'integer',
    gqlFieldType: Int,
    warthogColumnMeta: { readonly: true, ...options },
    dbDecorator: VersionColumn
  });

  return composeMethodDecorators(...factories);
}
