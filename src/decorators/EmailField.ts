import { IsEmail } from 'class-validator';
import { DecoratorCommonOptions } from '../metadata';
import { EmailWhereOperator } from '../torm';
import { composeMethodDecorators } from '../utils';
import { getCombinedDecorator } from './getCombinedDecorator';

interface EmailFieldOptions extends DecoratorCommonOptions {
  unique?: boolean;
  filter?: boolean | EmailWhereOperator[];
}

export function EmailField(options: EmailFieldOptions = {}): any {
  const optionsWithDefaults = { unique: true, ...options };

  const factories = getCombinedDecorator({
    fieldType: 'email',
    gqlFieldType: String,
    warthogColumnMeta: optionsWithDefaults
  });

  // Adds email validation
  factories.push(IsEmail());

  return composeMethodDecorators(...factories);
}
