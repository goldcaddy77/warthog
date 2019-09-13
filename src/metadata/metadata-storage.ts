export type ColumnType = 'boolean' | 'enum' | 'json';

export interface ColumnMetadata {
  type: ColumnType;
  propertyName: string;
  modelName: string;
  enum?: boolean;
  dataType?: string; // int16, jsonb, etc...
  isCreateDate?: boolean;
  isGenerated?: boolean;
  isNullable?: boolean;
  isPrimary?: boolean;
  isUpdateDate?: boolean;
  isVersion?: boolean;
  unique?: boolean;
}

export interface ModelMetadata {
  name: string;
  klass?: any; // optional because Class decorators added after field decorators
  filename?: string; // optional because Class decorators added after field decorators
  columns: ColumnMetadata[];
}

export class MetadataStorage {
  enumMap: { [table: string]: { [column: string]: any } } = {};
  classMap: { [table: string]: any } = {};
  models: { [table: string]: ModelMetadata } = {};

  addModel(name: string, klass: any, filename: string) {
    this.classMap[name] = {
      filename,
      klass,
      name
    };

    // Just add `klass` and `filename` to the model object
    this.models[name] = {
      ...this.models[name],
      klass,
      filename
    };
  }

  addEnum(
    modelName: string,
    columnName: string,
    enumName: string,
    enumValues: any,
    filename: string
  ) {
    this.enumMap[modelName] = this.enumMap[modelName] || {};
    this.enumMap[modelName][columnName] = {
      enumeration: enumValues,
      filename,
      name: enumName
    };

    this._addField('enum', modelName, columnName, { enum: true });
  }

  addBooleanField(modelName: string, columnName: string) {
    this._addField('boolean', modelName, columnName);
  }

  getModels() {
    return this.models;
  }

  getModel(name: string): ModelMetadata {
    return this.models[name];
  }

  getEnum(modelName: string, columnName: string) {
    if (!this.enumMap[modelName]) {
      return undefined;
    }
    return this.enumMap[modelName][columnName] || undefined;
  }

  _addField(type: ColumnType, modelName: string, columnName: string, options: object = {}) {
    if (!this.models[modelName]) {
      this.models[modelName] = {
        name: modelName,
        columns: []
      };
    }

    this.models[modelName].columns.push({
      type,
      propertyName: columnName,
      modelName,
      ...options
    });
  }

  uniquesForModel(model: ModelMetadata): string[] {
    model.toString();
    return ['id'];
  }

  // const numUniques = entity.columns.reduce<number>((num, column: ColumnMetadata) => {
  //   if (uniques.includes(column.propertyName) || column.isPrimary) {
  //     num++;
  //   }
  //   return num;
  // }, 0);

  uniquesForEntity(model: ModelMetadata): string[] {
    model.toString();
    return [];
    // return entity.uniques.reduce<string[]>(
    //   (arr, unique: UniqueMetadata) => {
    //     return [...arr, ...unique.columns.map((col: ColumnMetadata) => col.propertyName)];
    //   },
    //   [] as string[]
    // );
  }
}

export function getMetadataStorage(): MetadataStorage {
  if (!(global as any).WarthogMetadataStorage) {
    (global as any).WarthogMetadataStorage = new MetadataStorage();
  }
  return (global as any).WarthogMetadataStorage;
}
