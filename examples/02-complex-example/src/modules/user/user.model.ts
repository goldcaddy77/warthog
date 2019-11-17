// eslint-disable-next-line @typescript-eslint/no-var-requires
const { GraphQLJSONObject } = require('graphql-type-json');

// import { Authorized } from 'type-graphql';
import { Unique, Column } from 'typeorm';
import {
  BaseModel,
  BooleanField,
  CustomField,
  DateField,
  EmailField,
  EnumField,
  IdField,
  IntField,
  JSONField,
  JsonObject,
  Model,
  NumericField,
  StringField,
  FloatField
} from '../../../../../src';

// Note: this must be exported and in the same file where it's attached with @EnumField
// Also - must use string enums
export enum StringEnum {
  FOO = 'FOO',
  BAR = 'BAR'
}

@Model()
@Unique(['stringField', 'enumField'])
export class User extends BaseModel {
  @BooleanField({ nullable: true })
  booleanField: boolean;

  @DateField({ nullable: true })
  dateField: Date;

  @EmailField({ nullable: true })
  emailField: string;

  @EnumField('StringEnum', StringEnum, { nullable: true })
  enumField: StringEnum;

  // Default = "double precision"
  // See below for more variations
  @FloatField({ nullable: true })
  floatField?: number;

  // = "real"
  @FloatField({ dataType: 'float4', nullable: true })
  float4Field?: number;

  // = "real"
  @FloatField({ dataType: 'real', nullable: true })
  realField?: number;

  // = "double precision"
  @FloatField({ dataType: 'float8', nullable: true })
  float8Field?: number;

  // = "double precision"
  @FloatField({ dataType: 'double precision', nullable: true })
  doublePrecisionField?: number;

  // TODO: ForeignKeyField

  @IdField({ nullable: true })
  idField: string;

  // Default = `integer`
  // See below for more variations
  @IntField({ nullable: true })
  intDefaultField?: number;

  @JSONField({ nullable: true })
  jsonField?: JsonObject;

  @StringField({ maxLength: 50, minLength: 2, nullable: true })
  stringField: string;

  @Column({ nullable: true })
  dbOnlyColumn?: string;

  @StringField({ filter: false, nullable: true })
  noFilterField?: string;

  @StringField({ sort: false, nullable: true })
  noSortField?: string;

  @StringField({ filter: false, sort: false, nullable: true })
  noFilterOrSortField?: string;

  // IntField variations
  // It is recommended you only use
  // IntField() --> default = integer
  // IntField({ dataType: 'smallint' })
  // IntField({ dataType: 'bigint' })

  // `integer`
  @IntField({ dataType: 'int', nullable: true })
  intField?: number;

  // `integer`
  @IntField({ dataType: 'integer', nullable: true })
  integerField?: number;

  // `smallint`
  @IntField({ dataType: 'int2', nullable: true })
  int2Field?: number;

  // `integer`
  @IntField({ dataType: 'int4', nullable: true })
  int4Field?: number;

  // `bigint`
  @IntField({ dataType: 'int8', nullable: true })
  int8Field?: number;

  // `smallint`
  @IntField({ dataType: 'smallint', nullable: true })
  smallIntField?: number;

  // `bigint`
  @IntField({ dataType: 'bigint', nullable: true })
  bigIntField?: number;

  @NumericField({ nullable: true })
  numericField?: number;

  // StringField variations
  @StringField({ dataType: 'char', nullable: true })
  charField: string;

  @StringField({ dataType: 'character', nullable: true })
  characterField: string;

  @StringField({ dataType: 'character varying', nullable: true })
  characterVaryingField: string;

  @StringField({ dataType: 'text', nullable: true })
  textField: string;

  @StringField({ dataType: 'varchar', nullable: true })
  varcharField: string;

  // Spacial fields
  // https://github.com/typeorm/typeorm/blob/master/test/functional/spatial/postgres/entity/Post.ts
  @CustomField({
    fieldType: 'object',
    dataType: 'geometry',
    graphQLType: GraphQLJSONObject,
    nullable: true,
    dbOptions: { spatialFeatureType: 'Point' }
  })
  geometryField: object;
}
