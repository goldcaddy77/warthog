import { Container } from 'typedi';
import { getMetadataArgsStorage } from 'typeorm';

import { ColumnMetadata, getMetadataStorage, ModelMetadata } from '../metadata';

import {
  columnToGraphQLType,
  columnTypeToGraphQLDataType,
  columnInfoToTypeScriptType
} from './type-conversion';
import { WhereOperator } from '../torm';

const ignoreBaseModels = ['BaseModel', 'BaseModelUUID'];

export function getColumnsForModel(model: ModelMetadata) {
  const models = [model];
  const columns: { [key: string]: ColumnMetadata } = {};

  let superProto = model.klass ? model.klass.__proto__ : null;
  while (superProto) {
    const superModel = getMetadataStorage().getModel(superProto.name);
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

export function filenameToImportPath(filename: string): string {
  return filename.replace(/\.(j|t)s$/, '').replace(/\\/g, '/');
}

export function columnToGraphQLDataType(column: ColumnMetadata): string {
  return columnTypeToGraphQLDataType(column.type, column.enumName);
}

export function columnToTypeScriptType(column: ColumnMetadata): string {
  return columnInfoToTypeScriptType(column.type, column.enumName);
}

export function generateEnumMapImports(): string[] {
  const imports: string[] = [];
  const enumMap = getMetadataStorage().enumMap;

  Object.keys(enumMap).forEach((tableName: string) => {
    Object.keys(enumMap[tableName]).forEach((columnName: string) => {
      const enumColumn = enumMap[tableName][columnName];
      const filename = filenameToImportPath(enumColumn.filename);
      imports.push(`import { ${enumColumn.name} } from '${filename}'
`);
    });
  });

  const classMap = getMetadataStorage().classMap;
  Object.keys(classMap).forEach((tableName: string) => {
    const classObj = classMap[tableName];
    const filename = filenameToImportPath(classObj.filename);
    // Need to ts-ignore here for when we export compiled code
    // otherwise, it says we can't find a declaration file for this from the compiled code
    imports.push('// @ts-ignore\n');
    imports.push(`import { ${classObj.name} } from '${filename}'
`);
  });

  return imports;
}

export function entityToWhereUniqueInput(model: ModelMetadata): string {
  const uniques = getMetadataStorage().uniquesForModel(model);
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

  const modelColumns = getColumnsForModel(model);
  modelColumns.forEach((column: ColumnMetadata) => {
    // Uniques can be from Field or Unique annotations
    if (!modelUniques[column.propertyName]) {
      return;
    }

    const nullable = uniqueFieldsAreNullable ? ', { nullable: true }' : '';
    const graphQLDataType = columnToGraphQLDataType(column);
    const tsType = columnToTypeScriptType(column);

    fieldsTemplate += `
        @TypeGraphQLField(() => ${graphQLDataType}${nullable})
        ${column.propertyName}?: ${tsType};
      `;
  });

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

export function entityToCreateInput(model: ModelMetadata): string {
  const idsOnCreate =
    (Container.get('Config') as any).get('ALLOW_OPTIONAL_ID_ON_CREATE') === 'true';

  let fieldTemplates = '';

  if (idsOnCreate) {
    fieldTemplates += `
      @TypeGraphQLField({ nullable: true })
      id?: string;
    `;
  }

  const modelColumns = getColumnsForModel(model);
  modelColumns.forEach((column: ColumnMetadata) => {
    if (!column.editable || column.readonly) {
      return;
    }
    const graphQLDataType = columnToGraphQLDataType(column);
    const nullable = column.nullable ? '{ nullable: true }' : '';
    const tsRequired = column.nullable ? '?' : '!';
    const tsType = columnToTypeScriptType(column);

    if (columnRequiresExplicitGQLType(column)) {
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

export function entityToUpdateInput(model: ModelMetadata): string {
  let fieldTemplates = '';

  const modelColumns = getColumnsForModel(model);
  modelColumns.forEach((column: ColumnMetadata) => {
    if (!column.editable || column.readonly) {
      return;
    }

    // TODO: also don't allow updated foreign key fields
    // Example: photo.userId: String
    const graphQLDataType = columnToGraphQLDataType(column);
    const tsType = columnToTypeScriptType(column);

    if (columnRequiresExplicitGQLType(column)) {
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
export function entityToUpdateInputArgs(model: ModelMetadata): string {
  return `
    @ArgsType()
    export class ${model.name}UpdateArgs {
      @TypeGraphQLField() data!: ${model.name}UpdateInput;
      @TypeGraphQLField() where!: ${model.name}WhereUniqueInput;
    }
  `;
}

function columnToTypes(column: ColumnMetadata) {
  const graphqlType = columnToGraphQLType(column.type, column.enumName);
  const tsType = columnToTypeScriptType(column);

  return { graphqlType, tsType };
}

export function entityToWhereInput(model: ModelMetadata): string {
  let fieldTemplates = '';

  const modelColumns = getColumnsForModel(model);
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

    const { tsType } = columnToTypes(column);

    const graphQLDataType = columnToGraphQLDataType(column);

    // TODO: for foreign key fields, only allow the same filters as ID below
    // Example: photo.userId: String
    if (column.type === 'id') {
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
    } else if (column.type === 'float' || column.type === 'integer' || column.type === 'numeric') {
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
    } else if (column.type === 'date' || column.type === 'datetime' || column.type === 'dateonly') {
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

export function entityToWhereArgs(model: ModelMetadata): string {
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
export function entityToCreateManyArgs(model: ModelMetadata): string {
  return `
    @ArgsType()
    export class ${model.name}CreateManyArgs {
      @TypeGraphQLField(() => [${model.name}CreateInput])
      data!: ${model.name}CreateInput[];
    }
  `;
}

export function entityToOrderByEnum(model: ModelMetadata): string {
  let fieldsTemplate = '';

  const modelColumns = getColumnsForModel(model);
  modelColumns.forEach((column: ColumnMetadata) => {
    if (column.type === 'json') {
      return;
    }

    // If user says this is not sortable, then don't allow sorting
    // Also, if the column is "write only", therefore it cannot be read and shouldn't be sortable
    if (column.sort && !column.writeonly) {
      fieldsTemplate += `
        ${column.propertyName}_ASC = '${column.propertyName}_ASC',
        ${column.propertyName}_DESC = '${column.propertyName}_DESC',
      `;
    }
  });

  return `
    export enum ${model.name}OrderByEnum {
      ${fieldsTemplate}
    }

    registerEnumType(${model.name}OrderByEnum, {
      name: '${model.name}OrderByInput'
    });
  `;
}

function columnRequiresExplicitGQLType(column: ColumnMetadata) {
  return (
    column.enum ||
    column.type === 'json' ||
    column.type === 'id' ||
    column.type === 'date' ||
    column.type === 'datetime' ||
    column.type === 'dateonly'
  );
}
