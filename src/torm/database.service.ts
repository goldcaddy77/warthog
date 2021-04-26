import { Inject, Service } from 'typedi';
import { ConnectionOptions, createConnection as typeORMCreateConnection } from 'typeorm';

import { Config } from '../core/';

import { SnakeNamingStrategy } from './SnakeNamingStrategy';

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

@Service('Database')
export class Database {
  constructor(@Inject('Config') readonly config: Config) {}

  getBaseConfig() {
    return {
      cli: {
        entitiesDir: this.config.get('DB_ENTITIES_DIR'),
        migrationsDir: this.config.get('DB_MIGRATIONS_DIR'),
        subscribersDir: this.config.get('DB_SUBSCRIBERS_DIR')
      },
      database: this.config.get('DB_DATABASE')!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      entities: this.config.get('DB_ENTITIES'),
      host: this.config.get('DB_HOST')!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      logger: this.config.get('DB_LOGGER'),
      logging: this.config.get('DB_LOGGING')!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      migrations: this.config.get('DB_MIGRATIONS'),
      namingStrategy: new SnakeNamingStrategy(),
      password: this.config.get('DB_PASSWORD'),
      port: parseInt(this.config.get('DB_PORT') || '', 10),
      subscribers: this.config.get('DB_SUBSCRIBERS'),
      synchronize: this.config.get('DB_SYNCHRONIZE') === 'true',
      type: this.config.get('DB_CONNECTION')!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      username: this.config.get('DB_USERNAME')
    };
  }

  // Note: all DB options should be specified by environment variables
  // Either using TYPEORM_<variable> or WARTHOG_DB_<variable>
  async createDBConnection(dbOptions: Partial<ConnectionOptions> = {}) {
    const config = {
      ...this.getBaseConfig(),
      ...dbOptions
    };

    if (!config.database) {
      throw new Error("createConnection: 'database' is required");
    }
    // Logger.debug('createDBConnection', config);

    return typeORMCreateConnection(config as any); // TODO: fix any.  It is complaining about `type`
  }
}
