import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLScalarType,
  GraphQLString
} from 'graphql';
import { GraphQLISODateTime } from 'type-graphql';
import { Container } from 'typedi';
import { ColumnMetadata, getMetadataStorage, ModelMetadata } from '../metadata';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { GraphQLJSONObject } = require('graphql-type-json');

export function filenameToImportPath(filename: string): string {
  return filename.replace(/\.(j|t)s$/, '').replace(/\\/g, '/');
}

export function columnToGraphQLType(column: ColumnMetadata): GraphQLScalarType | GraphQLEnumType {
  if (column.type === 'enum' && column.enum) {
    return column.enum;
  }

  switch (column.type) {
    case 'id':
      return GraphQLID;
    case 'email':
    case 'string':
      return GraphQLString;
    case 'boolean':
      return GraphQLBoolean;
    case 'float':
      return GraphQLFloat;
    case 'integer':
      return GraphQLInt;
    case 'date':
      return GraphQLISODateTime;
    // return GraphQLString; // V2: This should be GraphQLISODateTime
    case 'json':
      return GraphQLJSONObject;
    case 'enum':
      // This is to make TS happy and so that we'll get a compile time error if a new type is added
      throw new Error("Will never get here because it's handled above");
  }
}

export function columnTypeToGraphQLDataType(column: ColumnMetadata): string {
  const graphQLType = columnToGraphQLType(column);

  // Sometimes we want to return the full blow GraphQL data type, but sometimes we want to return
  // the more readable name.  Ex:
  // GraphQLInt -> Int
  // GraphQLJSONObject -> GraphQLJSONObject
  switch (graphQLType) {
    case GraphQLJSONObject:
      return 'GraphQLJSONObject';
    default:
      return graphQLType.name;
  }
}

// const ID_TYPE = 'ID';
export function columnToTypeScriptType(column: ColumnMetadata): string {
  if (column.type === 'id') {
    return 'string'; // TODO: should this be ID_TYPE?
  } else if (column.enum) {
    return column.propertyName;
  } else {
    const graphqlType = columnTypeToGraphQLDataType(column);
    const typeMap: any = {
      Boolean: 'boolean',
      DateTime: 'Date',
      Float: 'number',
      GraphQLJSONObject: 'JSON',
      ID: 'string', // TODO: should this be ID_TYPE?
      Int: 'number',
      String: 'string'
    };

    return typeMap[graphqlType] || 'string';
  }
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

  // If there is only one unique field, it should not be nullable
  const uniqueFieldsAreNullable = uniques.length > 1;

  let fieldsTemplate = '';

  model.columns.forEach((column: ColumnMetadata) => {
    if (!column.unique) {
      return;
    }

    const nullable = uniqueFieldsAreNullable ? ', { nullable: true }' : '';
    const graphQLDataType = columnTypeToGraphQLDataType(column);
    const tsType = columnToTypeScriptType(column);

    fieldsTemplate += `
        @TypeGraphQLField(() => ${graphQLDataType}${nullable})
        ${column.propertyName}?: ${tsType};
      `;
  });

  const template = `
    @TypeGraphQLInputType()
    export class ${model.name}WhereUniqueInput {
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

  model.columns.forEach((column: ColumnMetadata) => {
    if (!column.editable) {
      return;
    }
    const graphQLDataType = columnTypeToGraphQLDataType(column);
    const nullable = column.nullable ? '{ nullable: true }' : '';
    const tsRequired = column.nullable ? '?' : '!';
    const tsType = columnToTypeScriptType(column);

    // we need to know what the graphql type is and what the tsType is
    // for enums

    if (column.enum || column.type === 'json') {
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

  return `
    @TypeGraphQLInputType()
    export class ${model.name}CreateInput {
      ${fieldTemplates}
    }
  `;
}

export function entityToUpdateInput(model: ModelMetadata): string {
  let fieldTemplates = '';

  model.columns.forEach((column: ColumnMetadata) => {
    if (!column.editable) {
      return;
    }

    // TODO: also don't allow updated foreign key fields
    // Example: photo.userId: String
    const graphQLDataType = columnTypeToGraphQLDataType(column);
    const tsType = columnToTypeScriptType(column);

    if (column.enum || column.type === 'json') {
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

  return `
    @TypeGraphQLInputType()
    export class ${model.name}UpdateInput {
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
  const graphqlType = columnToGraphQLType(column);
  const tsType = columnToTypeScriptType(column);

  return { graphqlType, tsType };
}

export function entityToWhereInput(model: ModelMetadata): string {
  let fieldTemplates = '';

  model.columns.forEach((column: ColumnMetadata) => {
    // Don't allow filtering on these fields
    if (!column.filters) {
      return;
    }

    const { tsType } = columnToTypes(column);

    const graphQLDataType = columnTypeToGraphQLDataType(column);

    // TODO: for foreign key fields, only allow the same filters as ID below
    // Example: photo.userId: String
    if (column.type === 'id') {
      fieldTemplates += `
        @TypeGraphQLField(() => ${graphQLDataType},{ nullable: true })
        ${column.propertyName}_eq?: string;

        @TypeGraphQLField(() => [${graphQLDataType}], { nullable: true })
        ${column.propertyName}_in?: string[];
      `;
    } else if (column.type === 'boolean') {
      fieldTemplates += `
        @TypeGraphQLField(() => ${graphQLDataType},{ nullable: true })
        ${column.propertyName}_eq?: Boolean;

        @TypeGraphQLField(() => [${graphQLDataType}], { nullable: true })
        ${column.propertyName}_in?: Boolean[];
      `;
    } else if (column.type === 'string' || column.type === 'email') {
      // TODO: do we need NOT?
      // `${column.propertyName}_not`
      fieldTemplates += `
        @TypeGraphQLField({ nullable: true })
        ${column.propertyName}_eq?: ${tsType};

        @TypeGraphQLField({ nullable: true })
        ${column.propertyName}_contains?: ${tsType};

        @TypeGraphQLField({ nullable: true })
        ${column.propertyName}_startsWith?: ${tsType};

        @TypeGraphQLField({ nullable: true })
        ${column.propertyName}_endsWith?: ${tsType};

        @TypeGraphQLField(() => [${graphQLDataType}], { nullable: true })
        ${column.propertyName}_in?: ${tsType}[];
      `;
    } else if (column.type === 'float' || column.type === 'integer') {
      fieldTemplates += `
        @TypeGraphQLField({ nullable: true })
        ${column.propertyName}_eq?: ${tsType};

        @TypeGraphQLField({ nullable: true })
        ${column.propertyName}_gt?: ${tsType};

        @TypeGraphQLField({ nullable: true })
        ${column.propertyName}_gte?: ${tsType};

        @TypeGraphQLField({ nullable: true })
        ${column.propertyName}_lt?: ${tsType};

        @TypeGraphQLField({ nullable: true })
        ${column.propertyName}_lte?: ${tsType};

        @TypeGraphQLField(() => [${graphQLDataType}], { nullable: true })
        ${column.propertyName}_in?: ${tsType}[];
      `;
    } else if (column.type === 'date') {
      // I really don't like putting this magic here, but it has to go somewhere
      // This deletedAt_all turns off the default filtering of soft-deleted items
      if (column.propertyName === 'deletedAt') {
        fieldTemplates += `
          @TypeGraphQLField({ nullable: true })
          deletedAt_all?: Boolean;
        `;
      }
      fieldTemplates += `
        @TypeGraphQLField({ nullable: true })
        ${column.propertyName}_eq?: ${tsType};

        @TypeGraphQLField({ nullable: true })
        ${column.propertyName}_lt?: ${tsType};

        @TypeGraphQLField({ nullable: true })
        ${column.propertyName}_lte?: ${tsType};

        @TypeGraphQLField({ nullable: true })
        ${column.propertyName}_gt?: ${tsType};

        @TypeGraphQLField({ nullable: true })
        ${column.propertyName}_gte?: ${tsType};
      `;
    } else if (column.type === 'enum') {
      // Enums will fall through here
      fieldTemplates += `
        @TypeGraphQLField(() => ${graphQLDataType}, { nullable: true })
        ${column.propertyName}_eq?: ${graphQLDataType};

        @TypeGraphQLField(() => [${graphQLDataType}], { nullable: true })
        ${column.propertyName}_in?: ${graphQLDataType}[];
      `;
    } else if (column.type === 'json') {
      // Determine how to handle JSON
    }
  });

  return `
    @TypeGraphQLInputType()
    export class ${model.name}WhereInput {
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

  model.columns.forEach((column: ColumnMetadata) => {
    if (column.orders) {
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
