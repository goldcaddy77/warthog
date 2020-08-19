import { IsEmail } from 'class-validator';

import { DecoratorCommonOptions } from '../metadata';
import { composeMethodDecorators } from '../utils';

import { getCombinedDecorator } from './getCombinedDecorator';

interface EmailFieldOptions extends DecoratorCommonOptions {
  unique?: boolean;
}

export function EmailField(options: EmailFieldOptions = {}): any {
  const optionsWithDefaults = { unique: true, ...options };

  const factories = getCombinedDecorator({
    fieldType: 'email',
    warthogColumnMeta: optionsWithDefaults
  });

  // Adds email validation
  factories.push(IsEmail());

  return composeMethodDecorators(...factories);
}
