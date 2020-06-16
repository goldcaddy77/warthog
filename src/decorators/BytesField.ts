import { ColumnNumericOptions } from 'typeorm/decorator/options/ColumnNumericOptions';
import { ColumnCommonOptions } from 'typeorm/decorator/options/ColumnCommonOptions';
import { ValueTransformer } from 'typeorm';

import { DecoratorCommonOptions } from '../metadata';
import { composeMethodDecorators } from '../utils';
import { ByteaColumnType } from '../torm';

import { getCombinedDecorator } from './getCombinedDecorator';

class BytesTransformer implements ValueTransformer {
  to(value: Buffer) {
    return value;
  }

  from(value: Buffer) {
    return '0x' + value.toString('hex');
  }
}

interface BytesFieldOptions
  extends ColumnCommonOptions,
    ColumnNumericOptions,
    DecoratorCommonOptions {
  dataType?: ByteaColumnType;
}

export function BytesField(options: BytesFieldOptions = {}): any {
  const { dataType, filter, sort, ...dbOptions } = options;
  const nullableOption = options.nullable === true ? { nullable: true } : {};

  dbOptions.transformer = new BytesTransformer();

  const factories = getCombinedDecorator({
    fieldType: 'string',
    warthogColumnMeta: options,
    gqlFieldType: String,
    dbType: 'bytea',
    dbColumnOptions: { ...nullableOption, ...dbOptions }
  });

  return composeMethodDecorators(...factories);
}
