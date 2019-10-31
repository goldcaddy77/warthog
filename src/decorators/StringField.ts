import { MaxLength, MinLength } from 'class-validator';
import { Field } from 'type-graphql';
import { Column, ColumnType } from 'typeorm';

import { FieldType, decoratorDefaults, getMetadataStorage } from '../metadata';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

interface StringFieldOptions {
  dataType?: ColumnType; // int16, jsonb, etc...
  maxLength?: number;
  minLength?: number;
  filters?: boolean | FieldType;
  nullable?: boolean;
  orders?: boolean;
  unique?: boolean;
}

export function StringField(args: StringFieldOptions = decoratorDefaults): any {
  const options = { ...decoratorDefaults, ...args };
  const nullableOption = options.nullable === true ? { nullable: true } : {};
  const maxLenOption = options.maxLength ? { length: options.maxLength } : {};
  const uniqueOption = options.unique ? { unique: true } : {};

  const registerWithWarthog = (target: object, propertyKey: string): any => {
    // Sorry, I put in some magic that automatically identified columns that end in Id to be ID columns
    // that only uses the ID filters (eq and in).  This was silly.  I've added a workaround here where you
    // can explicitly state which filters you want to use.  So if you have a field called userId and add filters: 'string'
    // this will bypass the magic Id logic below
    let fieldType: FieldType = 'string'; // default

    const explicitType = typeof args.filters === 'string' ? args.filters : null;
    if (explicitType) {
      fieldType = explicitType;
    }
    // V2: remove the auto-ID logic.  Need to keep this around as to not introduce a breaking change
    else if (propertyKey.match(/Id$/)) {
      fieldType = 'id';
    }

    getMetadataStorage().addField(fieldType, target.constructor.name, propertyKey, options);
  };

  // These are the 2 required decorators to get type-graphql and typeorm working
  const factories = [
    registerWithWarthog,
    // We explicitly say string here because when we're metaprogramming without
    // TS types, Field does not know that this should be a String
    Field(() => String, {
      ...nullableOption
    }),
    Column({
      type: args.dataType || 'varchar',
      ...maxLenOption,
      ...nullableOption,
      ...uniqueOption
    }) as MethodDecoratorFactory
  ];

  if (args.minLength) {
    factories.push(MinLength(args.minLength));
  }
  if (args.maxLength) {
    factories.push(MaxLength(args.maxLength));
  }

  return composeMethodDecorators(...factories);
}
