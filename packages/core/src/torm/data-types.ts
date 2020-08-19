// https://github.com/typeorm/typeorm/blob/master/src/driver/types/ColumnTypes.ts
export function defaultColumnType(databaseType: string, dataType: string) {
  const mapping: any = {
    postgres: {
      date: 'timestamp',
      float: 'float8',
      json: 'jsonb'
    }
  };

  if (!mapping[databaseType]) {
    throw new Error("Can't find databaseType");
  }
  if (!mapping[databaseType][dataType]) {
    throw new Error(`Can't find dataType for ${databaseType}`);
  }

  return mapping[databaseType][dataType];
}
