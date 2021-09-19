import { nanoid } from 'nanoid';

export class StringUtil {
  // Ex: HelloWorld -> HELLO_WORLD
  static constantize(str: string) {
    return (
      str
        .split(/([A-Z][a-z]+|[a-z]+)/)
        // This will return some empty strings that need to be filtered
        .filter((item: string) => {
          return item.length > 0;
        })
        .join('_')
        .toUpperCase()
    );
  }
}

export function generateId(): string {
  return nanoid();
}
