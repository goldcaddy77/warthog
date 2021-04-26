import { GraphQLEnumType } from 'graphql';
import { Container, Inject, Service } from 'typedi';

import { ColumnType, WhereOperator } from '../torm';
import { ClassType, Config } from '../core';

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

@Service('MetadataStorage')
export class MetadataStorage {
  enumMap: { [table: string]: { [column: string]: any } } = {};
  classMap: { [table: string]: any } = {};
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
    this.ensureModelExists(name, klass);

    // Just add `klass` and `filename` to the model object
    this.models[name] = {
      ...this.models[name],
      filename,
      ...options
    };

    // Only add klass if it wasn't already added by `addField`
    if (!this.models[name].klass) {
      this.models[name].klass = klass;
    }
  }

  addEnum(
    target: ClassType,
    columnName: string,
    enumName: string,
    enumValues: any,
    filename: string,
    options: ColumnOptions
  ) {
    const modelName = target.name;
    this.enumMap[modelName] = this.enumMap[modelName] || {};
    this.enumMap[modelName][columnName] = {
      enumeration: enumValues,
      filename,
      name: enumName
    };

    // the enum needs to be passed so that it can be bound to column metadata
    options.enum = enumValues;
    options.enumName = enumName;
    this.addField('enum', target, columnName, options);
  }

  getModels() {
    return this.models;
  }

  // https://stackoverflow.com/questions/42281045/can-typescript-property-decorators-set-metadata-for-the-class
  // https://stackoverflow.com/questions/55117125/typescript-decorators-reflect-metadata/55117327#55117327
  collect() {
    Object.keys(this.models).forEach(modelName => {
      const target = this.models[modelName].klass;
      const keys: string[] = Reflect.getMetadataKeys(target);

      keys.forEach(item => {
        if (!item.startsWith('warthog:field')) {
          return;
        }
        const metadata = Reflect.getMetadata(item, target);

        if (metadata.type === 'enum') {
          this.addEnum(
            target,
            metadata.propertyKey,
            metadata.name,
            metadata.enumeration,
            metadata.relativeFilePath,
            metadata.options
          );
        } else {
          this.addField(metadata.type, target, metadata.propertyKey, metadata.options);
        }
      });
    });
    return this;
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

  ensureModelExists(modelName: string, klass: ClassType) {
    if (!this.models[modelName]) {
      this.models[modelName] = {
        name: modelName,
        columns: [],
        klass
        // endpoints: []
      };
    }
  }

  // addEndpont(modelName: string, endpointType: EndpointType) {
  //   this.ensureModelExists(modelName);
  // }

  addField(
    type: FieldType,
    target: ClassType,
    columnName: string,
    options: Partial<ColumnMetadata> = {}
  ) {
    const modelName = target.name;
    if (!modelName) {
      return; // Not sure if this is needed anymore.  Previously this prevented base classes from registering
    }

    if (this.interfaces.indexOf(modelName) > -1) {
      return; // Don't add interfaces
    }

    this.ensureModelExists(modelName, target);

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
