import { ID } from 'type-graphql';
import { DecoratorCommonOptions } from '../metadata';
import { IdWhereOperator } from '../torm';
import { composeMethodDecorators } from '../utils';
import { getCombinedDecorator } from './getCombinedDecorator';

interface OwnerIdFieldOptions extends DecoratorCommonOptions {
  filter?: boolean | IdWhereOperator[];
}

export function OwnerIdField(options: OwnerIdFieldOptions = {}): any {
  const factories = getCombinedDecorator({
    fieldType: 'id',
    gqlFieldType: ID,
    warthogColumnMeta: { specialType: 'owner', nullable: false, readonly: true, ...options }
  });

  return composeMethodDecorators(...factories);
}
