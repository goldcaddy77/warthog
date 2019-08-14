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
import { EntityMetadata } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { UniqueMetadata } from 'typeorm/metadata/UniqueMetadata';
import { getMetadataStorage } from '../metadata';

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

function uniquesForEntity(entity: EntityMetadata): string[] {
  return entity.uniques.reduce<string[]>(
    (arr, unique: UniqueMetadata) => {
      return [...arr, ...unique.columns.map((col: ColumnMetadata) => col.propertyName)];
    },
    [] as string[]
  );
}

export function filenameToImportPath(filename: string): string {
  return filename.replace(/\.(j|t)s$/, '').replace(/\\/g, '/');
}

export function extractEnumObject(column: ColumnMetadata): GraphQLEnumType {
  return getMetadataStorage().getEnum(column.entityMetadata.name, column.propertyName);
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
    // case String:
    case 'String':
    case 'varchar':
    case 'text':
    case 'uuid':
      return GraphQLString;
    // case Boolean:
    // case 'Boolean':
    case 'boolean':
    case 'bool':
      return GraphQLBoolean;
    // case Number:
    // case 'Number':
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
    // case Date:
    // case 'Date':
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

export function entityToWhereUniqueInput(entity: EntityMetadata): string {
  const uniques = uniquesForEntity(entity);

  const numUniques = entity.columns.reduce<number>((num, column: ColumnMetadata) => {
    if (uniques.includes(column.propertyName) || column.isPrimary) {
      num++;
    }

    return num;
  }, 0);
  // If there is only one unique field, it should not be nullable
  const uniqueFieldsAreNullable = numUniques > 1;

  let fieldsTemplate = '';

  entity.columns.forEach((column: ColumnMetadata) => {
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
    export class ${entity.name}WhereUniqueInput {
      ${fieldsTemplate}
    }
  `;

  return template;
}

export function entityToCreateInput(entity: EntityMetadata): string {
  let fieldTemplates = '';

  entity.columns.forEach((column: ColumnMetadata) => {
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

      if (
        column.enum ||
        column.type === 'json' ||
        column.type === 'jsonb' ||
        column.type === 'varying character'
      ) {
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
    export class ${entity.name}CreateInput {
      ${fieldTemplates}
    }
  `;
}

export function entityToUpdateInput(entity: EntityMetadata): string {
  let fieldTemplates = '';

  entity.columns.forEach((column: ColumnMetadata) => {
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

      if (
        column.enum ||
        column.type === 'json' ||
        column.type === 'jsonb' ||
        column.type === 'varying character'
      ) {
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
    export class ${entity.name}UpdateInput {
      ${fieldTemplates}
    }
  `;
}

// Constructs required arguments needed when doing an update
export function entityToUpdateInputArgs(entity: EntityMetadata): string {
  return `
    @ArgsType()
    export class ${entity.name}UpdateArgs {
      @TypeGraphQLField() data!: ${entity.name}UpdateInput;
      @TypeGraphQLField() where!: ${entity.name}WhereUniqueInput;
    }
  `;
}

function columnToTypes(column: ColumnMetadata) {
  const graphqlType = columnToGraphQLType(column);
  const tsType = columnToTypeScriptType(column);

  return { graphqlType, tsType };
}

export function entityToWhereInput(entity: EntityMetadata): string {
  let fieldTemplates = '';

  entity.columns.forEach((column: ColumnMetadata) => {
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
    } else if (
      column.type !== 'json' &&
      column.type !== 'jsonb' &&
      column.type !== 'varying character'
    ) {
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
    export class ${entity.name}WhereInput extends BaseWhereInput {
      ${fieldTemplates}
    }
  `;
}

export function entityToWhereArgs(entity: EntityMetadata): string {
  return `
    @ArgsType()
    export class ${entity.name}WhereArgs extends PaginationArgs {
      @TypeGraphQLField(() => ${entity.name}WhereInput, { nullable: true })
      where?: ${entity.name}WhereInput;

      @TypeGraphQLField(() => ${entity.name}OrderByEnum, { nullable: true })
      orderBy?: ${entity.name}OrderByEnum;
    }
  `;
}

// Note: it would be great to inject a single `Arg` with the [entity.nameCreateInput] array arg,
// but that is not allowed by TypeGraphQL
export function entityToCreateManyArgs(entity: EntityMetadata): string {
  return `
    @ArgsType()
    export class ${entity.name}CreateManyArgs {
      @TypeGraphQLField(() => [${entity.name}CreateInput])
      data!: ${entity.name}CreateInput[];
    }
  `;
}

export function entityToOrderByEnum(entity: EntityMetadata): string {
  const ORDER_BY_BLACKLIST = ['createdById', 'updatedById', 'deletedById'];

  let fieldsTemplate = '';

  entity.columns.forEach((column: ColumnMetadata) => {
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
    export enum ${entity.name}OrderByEnum {
      ${fieldsTemplate}
    }

    registerEnumType(${entity.name}OrderByEnum, {
      name: '${entity.name}OrderByInput'
    });
  `;
}
