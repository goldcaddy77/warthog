import { ColumnMetadata, decoratorDefaults, getMetadataStorage, FieldType } from '../metadata';

export function WarthogField(fieldType: FieldType, args: Partial<ColumnMetadata> = {}): any {
  const options = { ...decoratorDefaults, ...args };

  return (target: object, propertyKey: string): any => {
    // console.log(propertyKey, options, args);

    getMetadataStorage().addField(fieldType, target.constructor.name, propertyKey, options);
  };
}
