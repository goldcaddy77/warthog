import { DecoratorCommonOptions } from '../metadata';
import { IdWhereOperator } from '../torm';
import { composeMethodDecorators } from '../utils';
import { getCombinedDecorator } from './getCombinedDecorator';

interface UpdatedByFieldOptions extends DecoratorCommonOptions {
  filter?: boolean | IdWhereOperator[];
}

export function UpdatedByField(options: UpdatedByFieldOptions = {}): any {
  const factories = getCombinedDecorator({
    fieldType: 'id',
    warthogColumnMeta: { specialType: 'updated-by', nullable: true, readonly: true, ...options }
  });

  return composeMethodDecorators(...factories);
}
