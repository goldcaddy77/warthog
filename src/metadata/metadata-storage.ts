import { GraphQLEnumType } from 'graphql';
import { ColumnType } from '../torm';

export type FieldType =
  | 'boolean'
  | 'date'
  | 'email'
  | 'enum'
  | 'float'
  | 'id'
  | 'integer'
  | 'json'
  | 'numeric'
  | 'string';

export const decoratorDefaults = {
  editable: true,
  filter: true,
  nullable: false,
  sort: true
};

export interface ColumnMetadata {
  type: FieldType;
  propertyName: string;
  dataType?: ColumnType; // int16, jsonb, etc...
  editable?: boolean;
  filter?: boolean;
  enum?: GraphQLEnumType;
  enumName?: string;
  nullable?: boolean;
  sort?: boolean;
  unique?: boolean;
}

export type ColumnOptions = Partial<ColumnMetadata>;

export interface ModelMetadata {
  abstract?: boolean;
  filename?: string; // optional because Class decorators added after field decorators
  klass?: any; // optional because Class decorators added after field decorators
  name: string;
  columns: ColumnMetadata[];
}

export class MetadataStorage {
  enumMap: { [table: string]: { [column: string]: any } } = {};
  classMap: { [table: string]: any } = {};
  models: { [table: string]: ModelMetadata } = {};
  interfaces: string[] = [];
  baseColumns: ColumnMetadata[] = [
    {
      propertyName: 'id',
      type: 'id',
      filter: true,
      nullable: false,
      sort: false,
      unique: true,
      editable: false
    },
    {
      propertyName: 'createdAt',
      type: 'date',
      editable: false,
      filter: true,
      nullable: false,
      sort: true,
      unique: false
    },
    {
      propertyName: 'createdById',
      type: 'id',
      editable: false,
      filter: true,
      nullable: false,
      sort: false,
      unique: false
    },
    {
      propertyName: 'updatedAt',
      type: 'date',
      editable: false,
      filter: true,
      nullable: true,
      sort: true,
      unique: false
    },
    {
      propertyName: 'updatedById',
      type: 'id',
      editable: false,
      filter: true,
      nullable: true,
      sort: false,
      unique: false
    },
    {
      propertyName: 'deletedAt',
      type: 'date',
      editable: false,
      filter: true,
      nullable: true,
      sort: true,
      unique: false
    },
    {
      propertyName: 'deletedById',
      type: 'id',
      editable: false,
      filter: true,
      nullable: true,
      sort: false,
      unique: false
    },
    {
      type: 'integer',
      propertyName: 'version',
      editable: false,
      filter: false,
      nullable: false,
      sort: false,
      unique: false
    }
  ];

  addModel(name: string, klass: any, filename: string, options = {}) {
    if (this.interfaces.indexOf(name) > -1) {
      return; // Don't add interface types to model list
    }

    this.classMap[name] = {
      filename,
      klass,
      name
    };

    // Just add `klass` and `filename` to the model object
    this.models[name] = {
      ...this.models[name],
      klass,
      filename,
      ...options
    };
  }

  addEnum(
    modelName: string,
    columnName: string,
    enumName: string,
    enumValues: any,
    filename: string,
    options: ColumnOptions
  ) {
    this.enumMap[modelName] = this.enumMap[modelName] || {};
    this.enumMap[modelName][columnName] = {
      enumeration: enumValues,
      filename,
      name: enumName
    };

    // the enum needs to be passed so that it can be bound to column metadata
    options.enum = enumValues;
    options.enumName = enumName;
    this.addField('enum', modelName, columnName, options);
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

  addField(
    type: FieldType,
    modelName: string,
    columnName: string,
    options: Partial<ColumnMetadata> = {}
  ) {
    if (this.interfaces.indexOf(modelName) > -1) {
      return; // Don't add interfaces
    }

    if (!this.models[modelName]) {
      this.models[modelName] = {
        name: modelName,
        columns: Array.from(this.baseColumns)
      };
    }

    this.models[modelName].columns.push({
      type,
      propertyName: columnName,
      ...options
    });
  }

  uniquesForModel(model: ModelMetadata): string[] {
    return model.columns.filter(column => column.unique).map(column => column.propertyName);
  }

  addInterfaceType(name: string) {
    this.addModel(name, null, '', { abstract: true });
  }
}

export function getMetadataStorage(): MetadataStorage {
  if (!(global as any).WarthogMetadataStorage) {
    (global as any).WarthogMetadataStorage = new MetadataStorage();
  }
  return (global as any).WarthogMetadataStorage;
}
