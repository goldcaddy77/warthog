import { ColumnNumericOptions } from 'typeorm/decorator/options/ColumnNumericOptions';
import { ColumnCommonOptions } from 'typeorm/decorator/options/ColumnCommonOptions';

import { DecoratorCommonOptions } from '../metadata';
import { composeMethodDecorators } from '../utils';
import { NumericColumnType } from '../torm';

import { getCombinedDecorator } from './getCombinedDecorator';

interface NumericFieldOptions
  extends ColumnCommonOptions,
    ColumnNumericOptions,
    DecoratorCommonOptions {
  dataType?: NumericColumnType;
}

export function NumericField(options: NumericFieldOptions = {}): any {
  const { dataType, filter, sort, ...dbOptions } = options;
  const nullableOption = options.nullable === true ? { nullable: true } : {};

  const factories = getCombinedDecorator({
    fieldType: 'numeric',
    warthogColumnMeta: options,
    gqlFieldType: String,
    dbType: options.dataType ?? 'numeric',
    dbColumnOptions: { ...nullableOption, ...dbOptions }
  });

  return composeMethodDecorators(...factories);
}
