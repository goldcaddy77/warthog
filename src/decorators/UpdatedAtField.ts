import { GraphQLISODateTime } from '@nestjs/graphql';
import { UpdateDateColumn } from 'typeorm';

import { DecoratorCommonOptions } from '../metadata';
import { DateTimeWhereOperator } from '../torm';
import { composeMethodDecorators } from '../utils';
import { getCombinedDecorator } from './getCombinedDecorator';

interface UpdatedAtFieldOptions extends DecoratorCommonOptions {
  filter?: boolean | DateTimeWhereOperator[];
}

export function UpdatedAtField(options: UpdatedAtFieldOptions = {}): any {
  const factories = getCombinedDecorator({
    fieldType: 'datetime',
    gqlFieldType: GraphQLISODateTime,
    warthogColumnMeta: { specialType: 'updated-at', nullable: true, readonly: true, ...options },
    dbDecorator: UpdateDateColumn
  });

  return composeMethodDecorators(...factories);
}
