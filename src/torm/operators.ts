import { SelectQueryBuilder } from 'typeorm';

export function addQueryBuilderWhereItem<E>(
  qb: SelectQueryBuilder<E>,
  dbTable: string,
  dbColumn: string,
  operator: string,
  value: any
): SelectQueryBuilder<E> {
  const column = `${dbTable}.${dbColumn}`;
  console.log('arguments', dbTable, dbColumn, column, operator, value);

  switch (operator) {
    case 'eq':
      if (value === null) {
        return qb.andWhere(`${column} IS NULL`);
      }
      return qb.andWhere(`${column} = :${dbColumn}`, { [dbColumn]: value });
    // // Not using "not" yet
    // case 'not':
    //   return [attr, Not(value)];
    case 'lt':
      return qb.andWhere(`${column} IS NULL`);
    case 'lte':
      return qb.andWhere(`${column} IS NULL`);
    case 'gt':
      return qb.andWhere(`${column} IS NULL`);
    case 'gte':
      return qb.andWhere(`${column} IS NULL`);
    case 'in':
      return qb.andWhere(`${column} IS NULL`);
    case 'contains':
      return qb.andWhere(`${column} IS NULL`);
    // return [attr, Raw(alias => `LOWER(${alias}) LIKE LOWER('%${value}%')`)];
    case 'startsWith':
      return qb.andWhere(`${column} IS NULL`);
    // return [attr, Raw(alias => `LOWER(${alias}) LIKE LOWER('${value}%')`)];
    case 'endsWith':
      return qb.andWhere(`${column} IS NULL`);
    // return [attr, Raw(alias => `LOWER(${alias}) LIKE LOWER('%${value}')`)];
    default:
      throw new Error(`Can't find operator ${operator}`);
  }
}
