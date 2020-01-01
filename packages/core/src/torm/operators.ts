import { SelectQueryBuilder } from 'typeorm';

export function addQueryBuilderWhereItem<E>(
  qb: SelectQueryBuilder<E>,
  dbColumn: string,
  columnWithAlias: string,
  operator: string,
  value: any
): SelectQueryBuilder<E> {
  switch (operator) {
    case 'eq':
      if (value === null) {
        return qb.andWhere(`${columnWithAlias} IS NULL`);
      }
      return qb.andWhere(`${columnWithAlias} = :${dbColumn}`, { [dbColumn]: value });
    case 'not':
      return qb.andWhere(`${columnWithAlias} != :${dbColumn}`, { [dbColumn]: value });
    case 'lt':
      return qb.andWhere(`${columnWithAlias} < :${dbColumn}`, { [dbColumn]: value });
    case 'lte':
      return qb.andWhere(`${columnWithAlias} <= :${dbColumn}`, { [dbColumn]: value });
    case 'gt':
      return qb.andWhere(`${columnWithAlias} > :${dbColumn}`, { [dbColumn]: value });
    case 'gte':
      return qb.andWhere(`${columnWithAlias} >= :${dbColumn}`, { [dbColumn]: value });
    case 'in':
      // IN (:... is the syntax for exploding array params into (?, ?, ?) in QueryBuilder
      return qb.andWhere(`${columnWithAlias} IN (:...${dbColumn})`, { [dbColumn]: value });
    case 'contains':
      return qb.andWhere(`LOWER(${columnWithAlias}) LIKE :${dbColumn}`, {
        [dbColumn]: `%${value}%`
      });
    case 'startsWith':
      return qb.andWhere(`LOWER(${columnWithAlias}) LIKE :${dbColumn}`, {
        [dbColumn]: `${value}%`
      });
    case 'endsWith':
      return qb.andWhere(`LOWER(${columnWithAlias}) LIKE :${dbColumn}`, {
        [dbColumn]: `%${value}`
      });
    default:
      throw new Error(`Can't find operator ${operator}`);
  }
}
