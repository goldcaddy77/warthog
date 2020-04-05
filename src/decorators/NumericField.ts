import { Float } from 'type-graphql';
import { ColumnNumericOptions } from 'typeorm/decorator/options/ColumnNumericOptions';
import { ColumnCommonOptions } from 'typeorm/decorator/options/ColumnCommonOptions';

import { decoratorDefaults, DecoratorDefaults } from '../metadata';
import { composeMethodDecorators } from '../utils';
import { NumericColumnType } from '../torm';

import { getCombinedDecorator } from './getCombinedDecorator';

interface NumericFieldOptions extends ColumnCommonOptions, ColumnNumericOptions, DecoratorDefaults {
  dataType?: NumericColumnType;
}

export function NumericField(args: NumericFieldOptions = decoratorDefaults): any {
  const { dataType, filter, sort, ...dbOptions } = args;
  const options = { ...decoratorDefaults, ...args };
  const nullableOption = options.nullable === true ? { nullable: true } : {};

  const factories = getCombinedDecorator({
    fieldType: 'numeric',
    columnMetadata: options,
    gqlFieldType: Float,
    dbType: args.dataType || 'numeric',
    columnOptions: { ...nullableOption, ...dbOptions }
  });

  return composeMethodDecorators(...factories);
}
