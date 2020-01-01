// See https://github.com/typeorm/typeorm/blob/master/test/functional/database-schema/column-types/postgres/entity/Post.ts

export type ColumnType =
  | IntColumnType
  | StringColumnType
  | FloatColumnType
  | NumericColumnType
  | JSONColumnType
  | BooleanColumnType
  | 'money'
  | 'citext'
  | 'hstore'
  | 'bytea'
  | 'bit'
  | 'varbit'
  | 'bit varying'
  | 'timetz'
  | 'timestamptz'
  | 'timestamp'
  | 'timestamp without time zone'
  | 'timestamp with time zone'
  | 'date'
  | 'time'
  | 'time without time zone'
  | 'time with time zone'
  | 'interval'
  | 'enum'
  | 'point'
  | 'line'
  | 'lseg'
  | 'box'
  | 'path'
  | 'polygon'
  | 'circle'
  | 'cidr'
  | 'inet'
  | 'macaddr'
  | 'tsvector'
  | 'tsquery'
  | 'uuid'
  | 'xml'
  | 'int4range'
  | 'int8range'
  | 'numrange'
  | 'tsrange'
  | 'tstzrange'
  | 'daterange'
  | 'geometry'
  | 'geography';

export type StringColumnType = 'varchar' | 'character varying' | 'character' | 'char' | 'text';
export type IntColumnType = 'int' | 'int2' | 'int4' | 'int8' | 'smallint' | 'integer' | 'bigint';
export type FloatColumnType = 'float' | 'float4' | 'float8' | 'real' | 'double precision';
export type NumericColumnType = 'numeric' | 'decimal';
export type MoneyColumnType = 'money';
export type JSONColumnType = 'json' | 'jsonb';
export type BooleanColumnType = 'bool' | 'boolean';
