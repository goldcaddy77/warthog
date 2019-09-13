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

const SYSTEM_FIELDS = [
  'createdAt',
  'createdById',
  'updatedAt',
  'updatedById',
  'deletedAt',
  'deletedById'
];

export function filenameToImportPath(filename: string): string {
  return filename.replace(/\.(j|t)s$/, '').replace(/\\/g, '/');
}

export function extractEnumObject(column: ColumnMetadata): GraphQLEnumType {
  // TODO: GENERATOR
  // const storage = getMetadataStorage();
  // const modelEnums = column.entityMetadata.inheritanceTree.map(model =>
  //   storage.getEnum(model.name, column.propertyName)
  // );

  // return modelEnums.find(m => Boolean(m));

  return getMetadataStorage().getEnum(column.modelName, column.propertyName);
}

export function columnToGraphQLType(column: ColumnMetadata): GraphQLScalarType | GraphQLEnumType {
  // Check to see if this column is an enum and return that
  if (column.enum) {
    return extractEnumObject(column);
  } else if (column.propertyName.match(/Id$/)) {
    return GraphQLID;
  }

  // Some types have a name attribute
  const type = (column.type as any).name ? (column.type as any).name : column.type;

  switch (type) {
    // TODO: clean up unused types (String and 'String')
    case String:
    case 'String':
    case 'varchar':
    case 'text':
    case 'uuid':
    case 'bytea':
      return GraphQLString;
    // TODO: clean up unused types (Boolean and 'Boolean')
    case Boolean:
    case 'Boolean':
    case 'boolean':
    case 'bool':
      return GraphQLBoolean;
    // TODO: clean up unused types (Number and 'Number')
    case Number:
    case 'Number':
    case 'float':
    case 'float4':
    case 'float8':
    case 'smallmoney':
    case 'money':
    case 'double':
    case 'dec':
    case 'decimal':
    case 'fixed':
    case 'numeric':
    case 'real':
    case 'double precision':
      return GraphQLFloat;
    case 'int':
    case 'smallint':
    case 'mediumint':
    case 'bigint':
    case 'integer':
    case 'int2':
    case 'int4':
    case 'int8':
      return GraphQLInt;
    // TODO: clean up unused types (Date and 'Date')
    case Date:
    case 'Date':
    case 'timestamp':
    case 'datetime':
      return GraphQLISODateTime;
    case 'json':
    case 'jsonb':
    case 'varying character': // HACK: allows us to generate proper types for sqlite (mock db)
      return GraphQLJSONObject;
    default:
      if (type instanceof GraphQLScalarType) {
        return type;
      }

      throw new Error(`convertToGraphQLType: Unexpected type: ${type}`);
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
  if (column.isPrimary) {
    return 'string'; // TODO: should this be ID_TYPE?
  } else if (column.enum) {
    return extractEnumObject(column).name;
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
    if (uniques.includes(column.propertyName) || column.isPrimary) {
      const nullable = uniqueFieldsAreNullable ? ', { nullable: true }' : '';
      const graphQLDataType = columnTypeToGraphQLDataType(column);
      const tsType = columnToTypeScriptType(column);

      fieldsTemplate += `
        @TypeGraphQLField(() => ${graphQLDataType}${nullable})
        ${column.propertyName}?: ${tsType};
      `;
    }
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
    if (
      !column.isPrimary &&
      !column.isCreateDate &&
      !column.isGenerated &&
      !column.isUpdateDate &&
      !column.isVersion &&
      !SYSTEM_FIELDS.includes(column.propertyName)
    ) {
      const graphQLDataType = columnTypeToGraphQLDataType(column);
      const nullable = column.isNullable ? '{ nullable: true }' : '';
      const tsRequired = column.isNullable ? '?' : '!';
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
    if (
      !column.isPrimary &&
      !column.isCreateDate &&
      !column.isGenerated &&
      !column.isUpdateDate &&
      !column.isVersion &&
      !SYSTEM_FIELDS.includes(column.propertyName)
    ) {
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
    if (column.isPrimary || column.isVersion || SYSTEM_FIELDS.includes(column.propertyName)) {
      return;
    }

    const { graphqlType, tsType } = columnToTypes(column);

    const graphQLDataType = columnTypeToGraphQLDataType(column);

    // TODO: for foreign key fields, only allow the same filters as ID below
    // Example: photo.userId: String
    if (column.isPrimary || graphqlType === GraphQLID) {
      fieldTemplates += `
        @TypeGraphQLField(() => ${graphQLDataType},{ nullable: true })
        ${column.propertyName}_eq?: string;

        @TypeGraphQLField(() => [${graphQLDataType}], { nullable: true })
        ${column.propertyName}_in?: string[];
      `;
    } else if (graphqlType === GraphQLString) {
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
    } else if (graphqlType === GraphQLFloat || graphqlType === GraphQLInt) {
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
    } else if (graphqlType === GraphQLISODateTime) {
      fieldTemplates += `
        @TypeGraphQLField({ nullable: true })
        ${column.propertyName}_gt?: ${tsType};

        @TypeGraphQLField({ nullable: true })
        ${column.propertyName}_gte?: ${tsType};

        @TypeGraphQLField({ nullable: true })
        ${column.propertyName}_lt?: ${tsType};

        @TypeGraphQLField({ nullable: true })
        ${column.propertyName}_lte?: ${tsType};
      `;
    } else if (column.type !== 'json') {
      // @@@ dcaddigan not sure what it means to search by JSONObjects
      // future release?

      // Enums will fall through here
      fieldTemplates += `
        @TypeGraphQLField(() => ${graphQLDataType}, { nullable: true })
        ${column.propertyName}_eq?: ${graphQLDataType};

        @TypeGraphQLField(() => [${graphQLDataType}], { nullable: true })
        ${column.propertyName}_in?: ${graphQLDataType}[];
      `;
    }
  });

  return `
    @TypeGraphQLInputType()
    export class ${model.name}WhereInput extends BaseWhereInput {
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
  const ORDER_BY_BLACKLIST = ['createdById', 'updatedById', 'deletedById'];

  let fieldsTemplate = '';

  model.columns.forEach((column: ColumnMetadata) => {
    if (
      !column.isPrimary &&
      !column.isVersion &&
      !ORDER_BY_BLACKLIST.includes(column.propertyName)
    ) {
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
