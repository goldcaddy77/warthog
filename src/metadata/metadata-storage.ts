import { GraphQLEnumType } from 'graphql';
import { Container, Inject, Service } from 'typedi';

import { ColumnType, WhereOperator } from '../torm';
import { Config } from '../core';

export type FieldType =
  | 'boolean'
  | 'date'
  | 'dateonly'
  | 'datetime'
  | 'email'
  | 'enum'
  | 'float'
  | 'id'
  | 'integer'
  | 'json'
  | 'numeric'
  | 'string';

export interface DecoratorCommonOptions {
  apiOnly?: boolean;
  dbOnly?: boolean;
  description?: string;
  editable?: boolean;
  filter?: boolean | WhereOperator[];
  nullable?: boolean;
  readonly?: boolean;
  sort?: boolean;
  writeonly?: boolean;
}

export interface ColumnMetadata extends DecoratorCommonOptions {
  type: FieldType;
  propertyName: string;
  dataType?: ColumnType; // int16, jsonb, etc...
  default?: any;
  enum?: GraphQLEnumType;
  enumName?: string;
  specialType?:
    | 'primary'
    | 'created-at'
    | 'created-by'
    | 'updated-at'
    | 'updated-by'
    | 'deleted-at'
    | 'deleted-by'
    | 'version';
  unique?: boolean;
  array?: boolean;
}

export type ColumnOptions = Partial<ColumnMetadata>;

export interface ModelMetadata {
  abstract?: boolean;
  filename?: string; // optional because Class decorators added after field decorators
  klass?: any; // optional because Class decorators added after field decorators
  name: string;
  columns: ColumnMetadata[];
  apiOnly?: boolean;
  dbOnly?: boolean;
}

type EndpointType =
  | 'find'
  | 'findOne'
  | 'connection'
  | 'create'
  | 'createMany'
  | 'update'
  | 'delete';

interface EndpointObject {
  find?: string;
  findOne?: string;
  connection?: string;
  create?: string;
  createMany?: string;
  update?: string;
  delete?: string;
}

@Service('MetadataStorage')
export class MetadataStorage {
  enumMap: { [table: string]: { [column: string]: any } } = {};
  classMap: { [table: string]: any } = {};
  endpoints: {
    [table: string]: EndpointObject;
  } = {};
  models: { [table: string]: ModelMetadata } = {};
  interfaces: string[] = [];

  decoratorDefaults: Partial<ColumnMetadata>;

  constructor(@Inject('Config') readonly config: Config) {
    const filterByDefault = this.config.get('FILTER_BY_DEFAULT') !== 'false';

    this.decoratorDefaults = {
      apiOnly: false,
      dbOnly: false,
      editable: true, // Deprecated
      // `true` by default, provide opt-out for backward compatability
      // V3: make this false by default
      filter: filterByDefault,
      nullable: false,
      readonly: false,
      sort: filterByDefault,
      unique: false,
      writeonly: false
    };

    // TODO: we need to ensure there is an ID field on the model
  }

  addModel(name: string, klass: any, filename: string, options: Partial<ModelMetadata> = {}) {
    if (this.interfaces.indexOf(name) > -1) {
      return; // Don't add interface types to model list
    }

    this.classMap[name] = {
      filename,
      klass,
      name
    };

    // We shouldn't need to do this as a field decorator will almost certainly have called this
    this.ensureModelExists(name);

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

  getModelColumns(modelName: string) {
    const model = this.getModel(modelName);
    return model.columns.map((column: ColumnMetadata) => column.propertyName);
  }

  getEnum(modelName: string, columnName: string) {
    if (!this.enumMap[modelName]) {
      return undefined;
    }
    return this.enumMap[modelName][columnName] || undefined;
  }

  ensureModelExists(modelName: string) {
    if (!this.models[modelName]) {
      this.models[modelName] = {
        name: modelName,
        columns: []
        // endpoints: []
      };
    }
  }

  // @debug('metadata-storage')
  addEndpont(
    type: EndpointType,
    modelGetter: Function,
    constructorName: string,
    propertyKey: string
  ) {
    const got = modelGetter();
    const model = Array.isArray(got) ? got[0] : got;

    console.log(type, model.name, constructorName, propertyKey);

    if (!this.endpoints[model.name]) {
      this.endpoints[model.name] = {};
    }
    if (!this.endpoints[model.name][type]) {
      this.endpoints[model.name][type] = propertyKey;
    }
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

    this.ensureModelExists(modelName);

    this.models[modelName].columns.push({
      type,
      propertyName: columnName,
      ...this.decoratorDefaults,
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
    // Since we can't use DI to inject this, just call into the container directly
    (global as any).WarthogMetadataStorage = Container.get('MetadataStorage');
  }
  return (global as any).WarthogMetadataStorage;
}
