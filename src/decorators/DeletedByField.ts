import { ID } from 'type-graphql';
import { DecoratorCommonOptions } from '../metadata';
import { IdWhereOperator } from '../torm';
import { composeMethodDecorators } from '../utils';
import { getCombinedDecorator } from './getCombinedDecorator';

interface DeletedByFieldOptions extends DecoratorCommonOptions {
  filter?: boolean | IdWhereOperator[];
}

export function DeletedByField(options: DeletedByFieldOptions = {}): any {
  const factories = getCombinedDecorator({
    fieldType: 'id',
    gqlFieldType: ID,
    warthogColumnMeta: { specialType: 'deleted-by', nullable: true, readonly: true, ...options }
  });

  return composeMethodDecorators(...factories);
}
