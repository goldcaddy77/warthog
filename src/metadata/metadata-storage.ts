export function getMetadataStorage(): MetadataStorage {
  if (!(global as any).WarthogMetadataStorage) {
    (global as any).WarthogMetadataStorage = new MetadataStorage();
  }
  return (global as any).WarthogMetadataStorage;
}

export class MetadataStorage {
  enumMap: { [table: string]: { [column: string]: any } } = {};

  addEnum(tableName: string, columnName: string, enumName: string, enumValues: any, filename: string) {
    this.enumMap[tableName] = this.enumMap[tableName] || {};
    this.enumMap[tableName][columnName] = {
      name: enumName,
      enumeration: enumValues,
      filename
    };
  }

  getEnum(tableName: string, columnName: string) {
    if (!this.enumMap[tableName]) {
      return undefined;
    }
    return this.enumMap[tableName][columnName] || undefined;
  }
}
