import { GraphQLISODateTime } from '@nestjs/graphql';
import { DecoratorCommonOptions } from '../metadata';
import { DateTimeWhereOperator } from '../torm';
import { composeMethodDecorators } from '../utils';
import { getCombinedDecorator } from './getCombinedDecorator';

interface DeletedAtFieldOptions extends DecoratorCommonOptions {
  filter?: boolean | DateTimeWhereOperator[];
}

export function DeletedAtField(options: DeletedAtFieldOptions = {}): any {
  const factories = getCombinedDecorator({
    fieldType: 'datetime',
    gqlFieldType: GraphQLISODateTime,
    warthogColumnMeta: { specialType: 'deleted-at', nullable: true, readonly: true, ...options }
  });

  return composeMethodDecorators(...factories);
}
