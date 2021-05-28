import * as prettier from 'prettier';
import { Container, Inject, Service } from 'typedi';
import { getMetadataArgsStorage } from 'typeorm';
import { Config } from '../core';
import { ColumnMetadata, getMetadataStorage, MetadataStorage, ModelMetadata } from '../metadata';
import { WhereOperator } from '../torm';
import {
  columnInfoToTypeScriptType,
  columnToGraphQLType,
  columnTypeToGraphQLDataType
} from './type-conversion';

const ignoreBaseModels = ['BaseModel', 'BaseModelUUID', 'IdModel'];

@Service('SchemaGenerator')
export class SchemaGenerator {
  metadata: MetadataStorage;

  constructor(@Inject('Config') readonly config: Config) {
    this.metadata = getMetadataStorage();
  }

  generate(
    // This will reference 'warthog in the deployed module, but we need to do a relative import in the examples library
    warthogImportPath = 'warthog'
  ): string {
    // Need to make sure we've collected all of the metadata off of our models
    this.metadata.collect();

    const templateArr = [
      `
      // This file has been auto-generated by Warthog.  Do not update directly as it
      // will be re-written.  If you need to change this file, update models or add
      // new TypeGraphQL objects
      // prettier-ignore
      // @ts-ignore
      import { DateResolver as Date } from 'graphql-scalars';
      // prettier-ignore
      // @ts-ignore
      import { GraphQLID as ID } from 'graphql';
      // prettier-ignore
      // @ts-ignore
      import { ArgsType, Field as TypeGraphQLField, Float, InputType as TypeGraphQLInputType, Int } from 'type-graphql';
      // prettier-ignore
      // @ts-ignore
      import { registerEnumType, GraphQLISODateTime as DateTime } from "type-graphql";

      // prettier-ignore
      // @ts-ignore eslint-disable-next-line @typescript-eslint/no-var-requires
      const { GraphQLJSONObject } = require('graphql-type-json');
      // prettier-ignore
      // @ts-ignore

      import { BaseWhereInput, JsonObject, PaginationArgs, DateOnlyString, DateTimeString, IDType } from '${warthogImportPath}';
      `
    ];

    templateArr.push(...this.generateEnumMapImports());
    templateArr.push(...this.generateClassImports());

    Object.keys(this.metadata.getModels()).forEach((modelName: string) => {
      const model: ModelMetadata = this.metadata.getModel(modelName);

      // If model is listed as dbOnly, don't generate any schema
      if (model.dbOnly === true) {
        return;
      }

      templateArr.push(this.entityToOrderByEnum(model));
      templateArr.push(this.entityToWhereInput(model));
      templateArr.push(this.entityToWhereUniqueInput(model));
      templateArr.push(this.entityToCreateInput(model));
      templateArr.push(this.entityToUpdateInput(model));
      templateArr.push(this.entityToWhereArgs(model));
      templateArr.push(this.entityToCreateManyArgs(model));
      templateArr.push(this.entityToUpdateInputArgs(model));
    });

    return this.format(templateArr.join('\n'));
  }

  getColumnsForModel(model: ModelMetadata) {
    const models = [model];
    const columns: { [key: string]: ColumnMetadata } = {};

    let superProto = model.klass ? model.klass.__proto__ : null;
    while (superProto) {
      const superModel = this.metadata.getModel(superProto.name);
      superModel && models.unshift(superModel);
      superProto = superProto.__proto__;
    }

    models.forEach(aModel => {
      aModel.columns.forEach((col: ColumnMetadata) => {
        columns[col.propertyName] = col;
      });
    });

    return Object.values(columns);
  }

  filenameToImportPath(filename: string): string {
    return filename.replace(/\.(j|t)s$/, '').replace(/\\/g, '/');
  }

  columnToGraphQLDataType(column: ColumnMetadata): string {
    return columnTypeToGraphQLDataType(column.type, column.enumName);
  }

  columnToTypeScriptType(column: ColumnMetadata): string {
    return columnInfoToTypeScriptType(column.type, column.enumName);
  }

  generateEnumMapImports(): string[] {
    const imports: string[] = [];
    const enumMap = this.metadata.enumMap;

    // Keep track of already imported items so that we don't attempt to import twice in the event the
    // enum is used in multiple models
    const imported = new Set();

    Object.keys(enumMap).forEach((tableName: string) => {
      Object.keys(enumMap[tableName]).forEach((columnName: string) => {
        const enumColumn = enumMap[tableName][columnName];
        if (imported.has(enumColumn.name)) {
          return;
        }
        imported.add(enumColumn.name);

        const filename = this.filenameToImportPath(enumColumn.filename);
        imports.push(`import { ${enumColumn.name} } from '${filename}'
  `);
      });
    });
    return imports;
  }

  generateClassImports(): string[] {
    const imports: string[] = [];

    const classMap = this.metadata.classMap;
    Object.keys(classMap).forEach((tableName: string) => {
      const classObj = classMap[tableName];
      const filename = this.filenameToImportPath(classObj.filename);
      // Need to ts-ignore here for when we export compiled code
      // otherwise, it says we can't find a declaration file for this from the compiled code
      imports.push('// @ts-ignore\n');
      imports.push(`import { ${classObj.name} } from '${filename}'
  `);
    });

    return imports;
  }

  entityToWhereUniqueInput(model: ModelMetadata): string {
    const uniques = this.metadata.uniquesForModel(model);
    const others = getMetadataArgsStorage().uniques;
    const modelUniques: { [key: string]: string } = {};
    others.forEach(o => {
      const name = (o.target as Function).name;
      const columns = o.columns as string[];
      if (name === model.name && columns) {
        columns.forEach((col: string) => {
          modelUniques[col] = col;
        });
      }
    });
    uniques.forEach(unique => {
      modelUniques[unique] = unique;
    });
    const distinctUniques = Object.keys(modelUniques);

    // If there is only one unique field, it should not be nullable
    const uniqueFieldsAreNullable = distinctUniques.length > 1;

    let fieldsTemplate = '';

    const modelColumns = this.getColumnsForModel(model);
    modelColumns.forEach((column: ColumnMetadata) => {
      // Uniques can be from Field or Unique annotations
      if (!modelUniques[column.propertyName]) {
        return;
      }

      const nullable = uniqueFieldsAreNullable ? ', { nullable: true }' : '';
      let graphQLDataType = this.columnToGraphQLDataType(column);
      let tsType = this.columnToTypeScriptType(column);

      if (column.array) {
        tsType = tsType.concat('[]');
        graphQLDataType = `[${graphQLDataType}]`;
      }

      fieldsTemplate += `
          @TypeGraphQLField(() => ${graphQLDataType}${nullable})
          ${column.propertyName}?: ${tsType};
        `;
    });

    if (!fieldsTemplate.length) {
      return ''; // If there are no uniques, don't generate the input
    }

    const superName = model.klass ? model.klass.__proto__.name : null;

    const classDeclaration =
      superName && !ignoreBaseModels.includes(superName)
        ? `${model.name}WhereUniqueInput extends ${superName}WhereUniqueInput`
        : `${model.name}WhereUniqueInput`;

    const template = `
      @TypeGraphQLInputType()
      export class ${classDeclaration} {
        ${fieldsTemplate}
      }
    `;

    return template;
  }

  entityToCreateInput(model: ModelMetadata): string {
    const idsOnCreate =
      (Container.get('Config') as Config).get('ALLOW_OPTIONAL_ID_ON_CREATE') === 'true';

    let fieldTemplates = '';

    if (idsOnCreate) {
      fieldTemplates += `
        @TypeGraphQLField({ nullable: true })
        id?: IDType; ${'' /* V3 breaking change: this was type string */}
      `;
    }

    const modelColumns = this.getColumnsForModel(model);

    modelColumns.forEach((column: ColumnMetadata) => {
      if (!column.editable || column.readonly) {
        return;
      }
      let graphQLDataType = this.columnToGraphQLDataType(column);
      const nullable = column.nullable ? '{ nullable: true }' : '';
      const tsRequired = column.nullable ? '?' : '!';
      let tsType = this.columnToTypeScriptType(column);

      if (column.array) {
        tsType = tsType.concat('[]');
        graphQLDataType = `[${graphQLDataType}]`;
      }

      if (this.columnRequiresExplicitGQLType(column)) {
        fieldTemplates += `
            @TypeGraphQLField(() => ${graphQLDataType}, ${nullable})
            ${column.propertyName}${tsRequired}: ${tsType};
         `;
      } else {
        fieldTemplates += `
            @TypeGraphQLField(${nullable})
            ${column.propertyName}${tsRequired}: ${tsType};
          `;
      }
    });

    const superName = model.klass ? model.klass.__proto__.name : null;

    const classDeclaration =
      superName && !ignoreBaseModels.includes(superName)
        ? `${model.name}CreateInput extends ${superName}CreateInput`
        : `${model.name}CreateInput`;

    return `
      @TypeGraphQLInputType()
      export class ${classDeclaration} {
        ${fieldTemplates}
      }
    `;
  }

  entityToUpdateInput(model: ModelMetadata): string {
    let fieldTemplates = '';

    const modelColumns = this.getColumnsForModel(model);
    modelColumns.forEach((column: ColumnMetadata) => {
      if (!column.editable || column.readonly) {
        return;
      }

      // TODO: also don't allow updated foreign key fields
      // Example: photo.userId: String
      let graphQLDataType = this.columnToGraphQLDataType(column);
      let tsType = this.columnToTypeScriptType(column);

      if (column.array) {
        tsType = tsType.concat('[]');
        graphQLDataType = `[${graphQLDataType}]`;
      }

      if (this.columnRequiresExplicitGQLType(column)) {
        fieldTemplates += `
          @TypeGraphQLField(() => ${graphQLDataType}, { nullable: true })
          ${column.propertyName}?: ${tsType};
        `;
      } else {
        fieldTemplates += `
          @TypeGraphQLField({ nullable: true })
          ${column.propertyName}?: ${tsType};
        `;
      }
    });

    const superName = model.klass ? model.klass.__proto__.name : null;

    const classDeclaration =
      superName && !ignoreBaseModels.includes(superName)
        ? `${model.name}UpdateInput extends ${superName}UpdateInput`
        : `${model.name}UpdateInput`;

    return `
      @TypeGraphQLInputType()
      export class ${classDeclaration} {
        ${fieldTemplates}
      }
    `;
  }

  // Constructs required arguments needed when doing an update
  entityToUpdateInputArgs(model: ModelMetadata): string {
    return `
      @ArgsType()
      export class ${model.name}UpdateArgs {
        @TypeGraphQLField() data!: ${model.name}UpdateInput;
        @TypeGraphQLField() where!: ${model.name}WhereUniqueInput;
      }
    `;
  }

  columnToTypes(column: ColumnMetadata) {
    const graphqlType = columnToGraphQLType(column.type, column.enumName);
    const tsType = this.columnToTypeScriptType(column);

    return { graphqlType, tsType };
  }

  entityToWhereInput(model: ModelMetadata): string {
    let fieldTemplates = '';

    const modelColumns = this.getColumnsForModel(model);
    modelColumns.forEach((column: ColumnMetadata) => {
      // If user specifically says not to filter (filter: false), then don't provide where inputs
      // Also, if the columns is "write only", then it cannot therefore be read and shouldn't have filters
      if (!column.filter || column.writeonly) {
        return;
      }

      function allowFilter(op: WhereOperator) {
        if (column.filter === true) {
          return true;
        }
        if (column.filter === false) {
          return false;
        }

        return !!column.filter?.includes(op);
      }

      const { tsType } = this.columnToTypes(column);

      const graphQLDataType = this.columnToGraphQLDataType(column);

      // TODO: for foreign key fields, only allow the same filters as ID below
      // Example: photo.userId: String
      if (column.array) {
        fieldTemplates += `
          @TypeGraphQLField(() => [${graphQLDataType}],{ nullable: true })
          ${column.propertyName}_containsAll?: [${tsType}];
  
          @TypeGraphQLField(() => [${graphQLDataType}],{ nullable: true })
          ${column.propertyName}_containsNone?: [${tsType}];
  
          @TypeGraphQLField(() => [${graphQLDataType}],{ nullable: true })
          ${column.propertyName}_containsAny?: [${tsType}];
        `;
      } else if (column.type === 'id') {
        const graphQlType = 'ID';

        if (allowFilter('eq')) {
          fieldTemplates += `
          @TypeGraphQLField(() => ${graphQlType},{ nullable: true })
          ${column.propertyName}_eq?: string;
        `;
        }

        if (allowFilter('in')) {
          fieldTemplates += `
          @TypeGraphQLField(() => [${graphQlType}], { nullable: true })
          ${column.propertyName}_in?: string[];
          `;
        }
      } else if (column.type === 'boolean') {
        if (allowFilter('eq')) {
          fieldTemplates += `
          @TypeGraphQLField(() => ${graphQLDataType},{ nullable: true })
          ${column.propertyName}_eq?: Boolean;
          `;
        }

        // V3: kill the boolean "in" clause
        if (allowFilter('in')) {
          fieldTemplates += `
          @TypeGraphQLField(() => [${graphQLDataType}], { nullable: true })
          ${column.propertyName}_in?: Boolean[];
        `;
        }
      } else if (column.type === 'string' || column.type === 'email') {
        // TODO: do we need NOT?
        // `${column.propertyName}_not`
        if (allowFilter('eq')) {
          fieldTemplates += `
            @TypeGraphQLField({ nullable: true })
            ${column.propertyName}_eq?: ${tsType};
          `;
        }

        if (allowFilter('contains')) {
          fieldTemplates += `
            @TypeGraphQLField({ nullable: true })
            ${column.propertyName}_contains?: ${tsType};
          `;
        }

        if (allowFilter('startsWith')) {
          fieldTemplates += `
            @TypeGraphQLField({ nullable: true })
            ${column.propertyName}_startsWith?: ${tsType};
          `;
        }

        if (allowFilter('endsWith')) {
          fieldTemplates += `
            @TypeGraphQLField({ nullable: true })
            ${column.propertyName}_endsWith?: ${tsType};
          `;
        }

        if (allowFilter('in')) {
          fieldTemplates += `
            @TypeGraphQLField(() => [${graphQLDataType}], { nullable: true })
            ${column.propertyName}_in?: ${tsType}[];
        `;
        }
      } else if (
        column.type === 'float' ||
        column.type === 'integer' ||
        column.type === 'numeric'
      ) {
        if (allowFilter('eq')) {
          fieldTemplates += `
          @TypeGraphQLField(() => ${graphQLDataType}, { nullable: true })
          ${column.propertyName}_eq?: ${tsType};
        `;
        }
        if (allowFilter('gt')) {
          fieldTemplates += `
          @TypeGraphQLField(() => ${graphQLDataType}, { nullable: true })
          ${column.propertyName}_gt?: ${tsType};
        `;
        }
        if (allowFilter('gte')) {
          fieldTemplates += `
          @TypeGraphQLField(() => ${graphQLDataType}, { nullable: true })
          ${column.propertyName}_gte?: ${tsType};
        `;
        }
        if (allowFilter('lt')) {
          fieldTemplates += `
          @TypeGraphQLField(() => ${graphQLDataType}, { nullable: true })
          ${column.propertyName}_lt?: ${tsType};
        `;
        }
        if (allowFilter('lte')) {
          fieldTemplates += `
          @TypeGraphQLField(() => ${graphQLDataType}, { nullable: true })
          ${column.propertyName}_lte?: ${tsType};
        `;
        }
        if (allowFilter('in')) {
          fieldTemplates += `
          @TypeGraphQLField(() => [${graphQLDataType}], { nullable: true })
          ${column.propertyName}_in?: ${tsType}[];
        `;
        }
      } else if (
        column.type === 'date' ||
        column.type === 'datetime' ||
        column.type === 'dateonly'
      ) {
        // I really don't like putting this magic here, but it has to go somewhere
        // This deletedAt_all turns off the default filtering of soft-deleted items
        if (column.propertyName === 'deletedAt') {
          fieldTemplates += `
          @TypeGraphQLField({ nullable: true })
            deletedAt_all?: Boolean;
          `;
        }

        if (allowFilter('eq')) {
          fieldTemplates += `
            @TypeGraphQLField(() => ${graphQLDataType}, { nullable: true })
            ${column.propertyName}_eq?: ${tsType};
          `;
        }
        if (allowFilter('lt')) {
          fieldTemplates += `
            @TypeGraphQLField(() => ${graphQLDataType}, { nullable: true })
            ${column.propertyName}_lt?: ${tsType};
          `;
        }

        if (allowFilter('lte')) {
          fieldTemplates += `
            @TypeGraphQLField(() => ${graphQLDataType}, { nullable: true })
            ${column.propertyName}_lte?: ${tsType};
          `;
        }

        if (allowFilter('gt')) {
          fieldTemplates += `   
            @TypeGraphQLField(() => ${graphQLDataType}, { nullable: true })
            ${column.propertyName}_gt?: ${tsType};
          `;
        }
        if (allowFilter('gte')) {
          fieldTemplates += `
            @TypeGraphQLField(() => ${graphQLDataType}, { nullable: true })
            ${column.propertyName}_gte?: ${tsType};
        `;
        }
      } else if (column.type === 'enum') {
        if (allowFilter('eq')) {
          fieldTemplates += `
            @TypeGraphQLField(() => ${graphQLDataType}, { nullable: true })
            ${column.propertyName}_eq?: ${graphQLDataType};
        `;
        }

        if (allowFilter('in')) {
          fieldTemplates += `
            @TypeGraphQLField(() => [${graphQLDataType}], { nullable: true })
            ${column.propertyName}_in?: ${graphQLDataType}[];
        `;
        }
      } else if (column.type === 'json') {
        fieldTemplates += `
          @TypeGraphQLField(() => GraphQLJSONObject, { nullable: true })
          ${column.propertyName}_json?: JsonObject;
        `;
      }
    });

    const superName = model.klass ? model.klass.__proto__.name : null;

    const classDeclaration =
      superName && !ignoreBaseModels.includes(superName)
        ? `${model.name}WhereInput extends ${superName}WhereInput`
        : `${model.name}WhereInput`;

    return `
      @TypeGraphQLInputType()
      export class ${classDeclaration} {
        ${fieldTemplates}
      }
    `;
  }

  entityToWhereArgs(model: ModelMetadata): string {
    return `
      @ArgsType()
      export class ${model.name}WhereArgs extends PaginationArgs {
        @TypeGraphQLField(() => ${model.name}WhereInput, { nullable: true })
        where?: ${model.name}WhereInput;
  
        @TypeGraphQLField(() => ${model.name}OrderByEnum, { nullable: true })
        orderBy?: ${model.name}OrderByEnum;
      }
    `;
  }

  // Note: it would be great to inject a single `Arg` with the [model.nameCreateInput] array arg,
  // but that is not allowed by TypeGraphQL
  entityToCreateManyArgs(model: ModelMetadata): string {
    return `
      @ArgsType()
      export class ${model.name}CreateManyArgs {
        @TypeGraphQLField(() => [${model.name}CreateInput])
        data!: ${model.name}CreateInput[];
      }
    `;
  }

  entityToOrderByEnum(model: ModelMetadata): string {
    const modelColumns = this.getColumnsForModel(model);
    const sortable = modelColumns
      .filter((column: ColumnMetadata) => {
        // Reasons we won't sort:
        // If user says this is not sortable
        // If column is type json
        // Also, if the column is "write only", therefore it cannot be read and shouldn't be sortable
        // Also, doesn't make sense to sort arrays
        if (!column.sort || column.type === 'json' || column.writeonly || column.array) {
          return false;
        }
        return true;
      })
      .map((column: ColumnMetadata) => column.propertyName);

    // At a minimum, allow sorting by id if no sorts are specified
    if (!sortable.length) {
      sortable.push('id');
    }

    return `
      export enum ${model.name}OrderByEnum {
        ${sortable
          .map(name => {
            return `
            ${name}_ASC = '${name}_ASC',
            ${name}_DESC = '${name}_DESC',
          `;
          })
          .join('')}
      }
  
      registerEnumType(${model.name}OrderByEnum, {
        name: '${model.name}OrderByInput'
      });
    `;
  }

  columnRequiresExplicitGQLType(column: ColumnMetadata) {
    return (
      column.enum ||
      column.array ||
      column.type === 'json' ||
      column.type === 'id' ||
      column.type === 'date' ||
      column.type === 'datetime' ||
      column.type === 'dateonly'
    );
  }

  format(code: string, options: prettier.Options = {}) {
    try {
      // TODO: grab our prettier options (single quote, etc...)
      return prettier.format(code, {
        ...options,
        parser: 'typescript'
      });
    } catch (e) {
      console.error(
        `There is a syntax error in generated code, unformatted code printed, error: ${JSON.stringify(
          e
        )}`
      );
      return code;
    }
  }
}
