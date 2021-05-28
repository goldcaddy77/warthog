import { ID } from 'type-graphql';
import { DecoratorCommonOptions } from '../metadata';
import { IdWhereOperator } from '../torm';
import { composeMethodDecorators } from '../utils';
import { getCombinedDecorator } from './getCombinedDecorator';

interface CreatedByFieldOptions extends DecoratorCommonOptions {
  filter?: boolean | IdWhereOperator[];
}

export function CreatedByField(options: CreatedByFieldOptions = {}): any {
  const factories = getCombinedDecorator({
    fieldType: 'id',
    gqlFieldType: ID,
    warthogColumnMeta: { specialType: 'created-by', readonly: true, ...options }
  });

  return composeMethodDecorators(...factories);
}
