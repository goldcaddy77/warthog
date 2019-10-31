import { SelectQueryBuilder } from 'typeorm';

export function addQueryBuilderWhereItem<E>(
  qb: SelectQueryBuilder<E>,
  dbTable: string,
  dbColumn: string,
  operator: string,
  value: any
): SelectQueryBuilder<E> {
  const column = `"${dbTable}"."${dbColumn}"`;
  console.log('arguments', dbTable, dbColumn, column, operator, value);

  switch (operator) {
    case 'eq':
      if (value === null) {
        return qb.andWhere(`${column} IS NULL`);
      }
      return qb.andWhere(`${column} = :${dbColumn}`, { [dbColumn]: value });
    case 'not':
      return qb.andWhere(`${column} != :${dbColumn}`, { [dbColumn]: value });
    case 'lt':
      return qb.andWhere(`${column} < :${dbColumn}`, { [dbColumn]: value });
    case 'lte':
      return qb.andWhere(`${column} <= :${dbColumn}`, { [dbColumn]: value });
    case 'gt':
      return qb.andWhere(`${column} > :${dbColumn}`, { [dbColumn]: value });
    case 'gte':
      return qb.andWhere(`${column} >= :${dbColumn}`, { [dbColumn]: value });
    case 'in':
      return qb.andWhere(`${column} IN (:${dbColumn})`, { [dbColumn]: value });
    case 'contains':
      return qb.andWhere(`LOWER(${column}) LIKE :${dbColumn}`, { [dbColumn]: `%${value}%` });
    case 'startsWith':
      return qb.andWhere(`LOWER(${column}) LIKE :${dbColumn}`, { [dbColumn]: `${value}%` });
    case 'endsWith':
      return qb.andWhere(`LOWER(${column}) LIKE :${dbColumn}`, { [dbColumn]: `%${value}` });
    default:
      throw new Error(`Can't find operator ${operator}`);
  }
}
