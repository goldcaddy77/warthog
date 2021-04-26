import { GraphQLISODateTime } from 'type-graphql';
import { CreateDateColumn } from 'typeorm';

import { DecoratorCommonOptions } from '../metadata';
import { DateTimeWhereOperator } from '../torm';
import { composeMethodDecorators } from '../utils';
import { getCombinedDecorator } from './getCombinedDecorator';

interface CreatedAtFieldOptions extends DecoratorCommonOptions {
  filter?: boolean | DateTimeWhereOperator[];
}

export function CreatedAtField(options: CreatedAtFieldOptions = {}): any {
  const factories = getCombinedDecorator({
    fieldType: 'datetime',
    dbType: 'timestamp',
    gqlFieldType: GraphQLISODateTime,
    warthogColumnMeta: { specialType: 'created-at', readonly: true, ...options },
    dbDecorator: CreateDateColumn
  });

  return composeMethodDecorators(...factories);
}
