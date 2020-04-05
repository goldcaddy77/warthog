import { Column, Unique } from 'typeorm';
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

  // FloatField variations
  // Default (same as dataType: 'float8', 'double precision')

  // See below for more variations
  @FloatField({ nullable: true })
  floatField?: number;

  // Note: same as "float4"
  @FloatField({ dataType: 'real', nullable: true })
  realField?: number;

  @IdField({ nullable: true })
  idField: string;

  // IntField variations
  // Default (same as dataType: 'int', `integer`, `int4`)
  @IntField({ nullable: true })
  intFieldDefault?: number;

  // `smallint` (same as `int2`)
  @IntField({ dataType: 'smallint', nullable: true })
  smallIntField?: number;

  // `bigint` (same as `int8`)
  @IntField({ dataType: 'bigint', nullable: true })
  bigIntField?: number;

  @JSONField({ nullable: true })
  jsonField?: JsonObject;

  @JSONField({ filter: false, nullable: true })
  jsonFieldNoFilter?: JsonObject;

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

  // See https://github.com/typeorm/typeorm/blob/a4dec02cc59d3219a29c7be0322af2253e1452dc/test/functional/database-schema/column-types/postgres/entity/PostWithOptions.ts
  // Numeric fields (exact precision)
  @NumericField({ nullable: true })
  numericField?: number;

  @NumericField({ nullable: true, precision: 5, scale: 2 })
  numericFieldCustomPrecisionScale?: number;

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
    api: { type: 'json', nullable: true },
    db: { type: 'geometry', spatialFeatureType: 'Point', nullable: false }
  })
  geometryField?: object;

  // Addition integer fields
  // Note: it is advised to only use @IntField, @IntField({ dataType: 'smallint' }) and
  // @IntField({ dataType: 'bigint' }), but the following are also possible

  // `int`
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

  // Addition float fields
  // Note: it is advised to only use @FloatField and @FloatField({ dataType: 'real' })

  // = "real"
  @FloatField({ dataType: 'float4', nullable: true })
  float4Field?: number;

  // = "double precision"
  @FloatField({ dataType: 'float8', nullable: true })
  float8Field?: number;

  // = "double precision"
  @FloatField({ dataType: 'double precision', nullable: true })
  doublePrecisionField?: number;

  @StringField({ writeonly: true, nullable: true })
  password!: string;

  @StringField({ writeonly: true, nullable: true })
  writeonlyField!: string;

  @StringField({ readonly: true, nullable: true })
  readonlyField!: string;

  // TODO: ForeignKeyField
}
