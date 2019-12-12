import { SelectQueryBuilder } from 'typeorm';

export function addQueryBuilderWhereItem<E>(
  qb: SelectQueryBuilder<E>,
  valueKey: string,
  columnWithAlias: string,
  operator: string,
  value: any
): SelectQueryBuilder<E> {
  switch (operator) {
    case 'eq':
      if (value === null) {
        return qb.andWhere(`${columnWithAlias} IS NULL`);
      }
      return qb.andWhere(`${columnWithAlias} = :${valueKey}`, { [valueKey]: value });
    case 'not':
      return qb.andWhere(`${columnWithAlias} != :${valueKey}`, { [valueKey]: value });
    case 'lt':
      return qb.andWhere(`${columnWithAlias} < :${valueKey}`, { [valueKey]: value });
    case 'lte':
      return qb.andWhere(`${columnWithAlias} <= :${valueKey}`, { [valueKey]: value });
    case 'gt':
      return qb.andWhere(`${columnWithAlias} > :${valueKey}`, { [valueKey]: value });
    case 'gte':
      return qb.andWhere(`${columnWithAlias} >= :${valueKey}`, { [valueKey]: value });
    case 'in':
      // IN (:... is the syntax for exploding array params into (?, ?, ?) in QueryBuilder
      return qb.andWhere(`${columnWithAlias} IN (:...${valueKey})`, { [valueKey]: value });
    case 'contains':
      return qb.andWhere(`LOWER(${columnWithAlias}) LIKE :${valueKey}`, {
        [valueKey]: `%${value}%`
      });
    case 'startsWith':
      return qb.andWhere(`LOWER(${columnWithAlias}) LIKE :${valueKey}`, {
        [valueKey]: `${value}%`
      });
    case 'endsWith':
      return qb.andWhere(`LOWER(${columnWithAlias}) LIKE :${valueKey}`, {
        [valueKey]: `%${value}`
      });
    default:
      throw new Error(`Can't find operator ${operator}`);
  }
}
