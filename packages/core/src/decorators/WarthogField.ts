import { ColumnMetadata, getMetadataStorage, FieldType } from '../metadata';

export function WarthogField(fieldType: FieldType, options: Partial<ColumnMetadata> = {}): any {
  return (target: object, propertyKey: string): any => {
    getMetadataStorage().addField(fieldType, target.constructor.name, propertyKey, options);
  };
}
