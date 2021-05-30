import { composeMethodDecorators } from '../utils';
import { getCombinedDecorator } from './getCombinedDecorator';

interface TextFieldOptions {
  description?: string;
  editable?: boolean;
  nullable?: boolean;
  readonly?: boolean;
  writeonly?: boolean;
}

export function TextField(options: TextFieldOptions = {}): any {
  const factories = getCombinedDecorator({
    fieldType: 'text',
    gqlFieldType: String,
    warthogColumnMeta: options
  });

  return composeMethodDecorators(...factories);
}
