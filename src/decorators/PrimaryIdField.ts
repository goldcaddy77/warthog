import { ID } from 'type-graphql';
import { PrimaryColumn } from 'typeorm';

import { DecoratorCommonOptions } from '../metadata';
import { IdWhereOperator } from '../torm';
import { composeMethodDecorators } from '../utils';
import { getCombinedDecorator } from './getCombinedDecorator';

interface PrimaryIdFieldOptions extends DecoratorCommonOptions {
  filter?: boolean | IdWhereOperator[];
  readonly?: boolean;
}

export function PrimaryIdField(options: PrimaryIdFieldOptions = {}): any {
  if (typeof options.filter === 'undefined') {
    options.filter = ['eq', 'in'];
  }

  const factories = getCombinedDecorator({
    fieldType: 'id',
    gqlFieldType: ID,
    warthogColumnMeta: { specialType: 'primary', unique: true, readonly: true, ...options },
    dbDecorator: PrimaryColumn
  });

  return composeMethodDecorators(...factories);
}
