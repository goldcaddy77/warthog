import { Float } from 'type-graphql';
import { ColumnNumericOptions } from 'typeorm/decorator/options/ColumnNumericOptions';
import { ColumnCommonOptions } from 'typeorm/decorator/options/ColumnCommonOptions';

import { DecoratorDefaults } from '../metadata';
import { composeMethodDecorators } from '../utils';
import { NumericColumnType } from '../torm';

import { getCombinedDecorator } from './getCombinedDecorator';

interface NumericFieldOptions extends ColumnCommonOptions, ColumnNumericOptions, DecoratorDefaults {
  dataType?: NumericColumnType;
}

export function NumericField(options: NumericFieldOptions = {}): any {
  const { dataType, filter, sort, ...dbOptions } = options;
  const nullableOption = options.nullable === true ? { nullable: true } : {};

  const factories = getCombinedDecorator({
    fieldType: 'numeric',
    warthogColumnMeta: options,
    gqlFieldType: Float,
    dbType: options.dataType ?? 'numeric',
    dbColumnOptions: { ...nullableOption, ...dbOptions }
  });

  return composeMethodDecorators(...factories);
}
