import { Field } from 'type-graphql';
import { Column, ColumnOptions } from 'typeorm';
// https://github.com/typeorm/typeorm/blob/c87e4e7ad92023a1914a6a1778d683ba8f23c5ab/src/decorator/options/ColumnCommonOptions.ts
// import { ColumnCommonOptions } from 'typeorm/decorator/options/ColumnCommonOptions';

import { decoratorDefaults, FieldType } from '../metadata';
import { ColumnType } from '../torm';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';
import { WarthogField } from './WarthogField';

interface CustomFieldOptions {
  fieldType: FieldType;
  dataType: ColumnType;
  dbOptions: ColumnOptions;
  graphQLType: any;
  filter?: boolean;
  nullable?: boolean;
  sort?: boolean;
}

export function CustomField(args: CustomFieldOptions): any {
  const options = { ...decoratorDefaults, ...args };
  const nullableOption = options.nullable === true ? { nullable: true } : {};

  // These are the 2 required decorators to get type-graphql and typeorm working
  const factories = [
    WarthogField(options.fieldType, options),
    Field(() => args.graphQLType, {
      ...nullableOption
    }),
    Column({ type: args.dataType, ...nullableOption }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
