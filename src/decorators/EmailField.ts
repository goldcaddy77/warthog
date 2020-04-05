import { IsEmail } from 'class-validator';

import { decoratorDefaults, DecoratorDefaults } from '../metadata';
import { composeMethodDecorators } from '../utils';

import { getCombinedDecorator } from './getCombinedDecorator';

interface EmailFieldOptions extends DecoratorDefaults {
  unique?: boolean;
}

export function EmailField(args: EmailFieldOptions = {}): any {
  const options = { unique: true, ...decoratorDefaults, ...args };

  const factories = getCombinedDecorator({
    fieldType: 'email',
    columnMetadata: options
  });

  // Adds email validation
  factories.push(IsEmail());

  return composeMethodDecorators(...factories);
}
