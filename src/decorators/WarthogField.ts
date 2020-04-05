import { ColumnMetadata, getMetadataStorage, FieldType } from '../metadata';

export function WarthogField(fieldType: FieldType, options: Partial<ColumnMetadata> = {}): any {
  return (target: object, propertyKey: string): any => {
    // console.log(propertyKey, options, args);

    getMetadataStorage().addField(fieldType, target.constructor.name, propertyKey, options);
  };
}
