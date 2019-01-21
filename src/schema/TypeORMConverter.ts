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

export function entityListToImports(entities: EntityMetadata[]): string[] {
  const imports: string[] = [];
  const enumMap = getMetadataStorage().enumMap;

  Object.keys(enumMap).forEach((tableName: string) => {
    Object.keys(enumMap[tableName]).forEach((columnName: string) => {
      const enumColumn = enumMap[tableName][columnName];
      const filename = enumColumn.filename.replace(/\.(j|t)s$/, '');
      imports.push(`import { ${enumColumn.name} } from '${filename}'
`);
    });
  });

  const classMap = getMetadataStorage().classMap;
  Object.keys(classMap).forEach((tableName: string) => {
    const classObj = classMap[tableName];
    const filename = classObj.filename.replace(/\.(j|t)s$/, '');
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
        @Field(type => ${graphQLDataType}${nullable})
        ${column.propertyName}?: ${tsType};
      `;
    }
  });

  const template = `
    @InputType()
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
      const graphQLType = columnToGraphQLType(column);
      const nullable = column.isNullable ? '{ nullable: true }' : '';
      const tsRequired = column.isNullable ? '?' : '!';
      const tsType = columnToTypeScriptType(column);

      if (column.enum) {
        fieldTemplates += `
          @Field(type => ${graphQLType}, ${nullable})
          ${column.propertyName}${tsRequired}: ${graphQLType};
       `;
      } else {
        fieldTemplates += `
          @Field(${nullable})
          ${column.propertyName}${tsRequired}: ${tsType};
        `;
      }
    }
  });

  return `
    @InputType()
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
      const graphQLType = columnToGraphQLType(column);
      const tsType = columnToTypeScriptType(column);

      if (column.enum) {
        fieldTemplates += `
        @Field(type => ${graphQLType}, { nullable: true })
        ${column.propertyName}?: ${graphQLType};
      `;
      } else {
        fieldTemplates += `
        @Field({ nullable: true })
        ${column.propertyName}?: ${tsType};
      `;
      }
    }
  });

  return `
    @InputType()
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
      @Field() data!: ${entity.name}UpdateInput;
      @Field() where!: ${entity.name}WhereUniqueInput;
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

    // TODO: for foreign key fields, only allow the same filters as ID below
    // Example: photo.userId: String
    if (column.isPrimary || graphqlType === GraphQLID) {
      fieldTemplates += `
        @Field(type => ${graphqlType},{ nullable: true })
        ${column.propertyName}_eq?: string;

        @Field(type => [${graphqlType}], { nullable: true })
        ${column.propertyName}_in?: string[];
      `;
    } else if (graphqlType === GraphQLString) {
      // TODO: do we need NOT?
      // `${column.propertyName}_not`
      fieldTemplates += `
        @Field({ nullable: true })
        ${column.propertyName}_eq?: ${tsType};

        @Field({ nullable: true })
        ${column.propertyName}_contains?: ${tsType};

        @Field({ nullable: true })
        ${column.propertyName}_startsWith?: ${tsType};

        @Field({ nullable: true })
        ${column.propertyName}_endsWith?: ${tsType};

        @Field(type => [${graphqlType}], { nullable: true })
        ${column.propertyName}_in?: ${tsType}[];
      `;
    } else if (graphqlType === GraphQLFloat || graphqlType === GraphQLInt) {
      fieldTemplates += `
        @Field({ nullable: true })
        ${column.propertyName}_eq?: ${tsType};

        @Field({ nullable: true })
        ${column.propertyName}_gt?: ${tsType};

        @Field({ nullable: true })
        ${column.propertyName}_gte?: ${tsType};

        @Field({ nullable: true })
        ${column.propertyName}_lt?: ${tsType};

        @Field({ nullable: true })
        ${column.propertyName}_lte?: ${tsType};

        @Field(type => [${graphqlType}], { nullable: true })
        ${column.propertyName}_in?: ${tsType}[];
      `;
    } else if (graphqlType === GraphQLISODateTime) {
      fieldTemplates += `
        @Field({ nullable: true })
        ${column.propertyName}_gt?: ${tsType};

        @Field({ nullable: true })
        ${column.propertyName}_gte?: ${tsType};

        @Field({ nullable: true })
        ${column.propertyName}_lt?: ${tsType};

        @Field({ nullable: true })
        ${column.propertyName}_lte?: ${tsType};
      `;
    } else {
      // Enums will fall through here
      fieldTemplates += `
        @Field(type => ${graphqlType}, { nullable: true })
        ${column.propertyName}_eq?: ${graphqlType};

        @Field(type => [${graphqlType}], { nullable: true })
        ${column.propertyName}_in?: ${graphqlType}[];
      `;
    }
  });

  return `
    @InputType()
    export class ${entity.name}WhereInput extends BaseWhereInput {
      ${fieldTemplates}
    }
  `;
}

export function entityToWhereArgs(entity: EntityMetadata): string {
  return `
    @ArgsType()
    export class ${entity.name}WhereArgs extends PaginationArgs {
      @Field(type => ${entity.name}WhereInput, { nullable: true })
      where?: ${entity.name}WhereInput;

      @Field(type => ${entity.name}OrderByEnum, { nullable: true })
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
      @Field(type => [${entity.name}CreateInput])
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

// const ID_TYPE = 'ID';
export function columnToTypeScriptType(column: ColumnMetadata): string {
  if (column.isPrimary) {
    return 'string'; // TODO: should this be ID_TYPE?
  } else {
    const graphqlType = columnTypeToGraphQLDataType(column);
    const typeMap: any = {
      DateTime: 'string',
      ID: 'string', // TODO: should this be ID_TYPE?
      String: 'string'
    };

    return typeMap[graphqlType] || 'string';
  }
}

export function columnTypeToGraphQLDataType(column: ColumnMetadata): string {
  return columnToGraphQLType(column).name;
}
export function columnToGraphQLType(column: ColumnMetadata): GraphQLScalarType | GraphQLEnumType {
  // Check to see if this column is an enum and return that
  const enumObject = getMetadataStorage().getEnum(column.entityMetadata.name, column.propertyName);
  if (enumObject) {
    return enumObject.name;
  } else if (column.propertyName.match(/Id$/)) {
    return GraphQLID;
  }

  // Some types have a name attribute
  const type = (column.type as any).name ? (column.type as any).name : column.type;

  if (type instanceof GraphQLScalarType) {
    return type;
  }

  switch (type) {
    case String:
    case 'String':
    case 'varchar':
    case 'text':
      return GraphQLString;
    case Boolean:
    case 'Boolean':
    case 'boolean':
    case 'bool':
      return GraphQLBoolean;
    case Number:
    case 'Number':
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
    case Date:
    case 'Date':
    case 'timestamp':
      return GraphQLISODateTime;
    default:
      throw new Error(`convertToGraphQLType: Unexpected type: ${type}`);
  }
}
