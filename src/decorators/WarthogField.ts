import 'reflect-metadata';

import { ClassType } from '../core';
import { ColumnMetadata, FieldType } from '../metadata';

export function WarthogField(fieldType: FieldType, options: Partial<ColumnMetadata> = {}): any {
  return (target: ClassType, propertyKey: string): any => {
    Reflect.defineMetadata(
      `warthog:field:${propertyKey}`,
      {
        type: fieldType,
        propertyKey,
        options
      },
      target.constructor // Access contructor instead of class instance
    );
  };
}
