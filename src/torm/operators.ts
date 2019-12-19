import { SelectQueryBuilder } from 'typeorm';

export function addQueryBuilderWhereItem<E>(
  qb: SelectQueryBuilder<E>,
  dbColumn: string,
  columnWithAlias: string,
  operator: string,
  value: any,
  columnUniqueKey?: string
): SelectQueryBuilder<E> {
  dbColumn = columnUniqueKey || dbColumn;

  if (typeof value === 'object') {
    const flat = flattenObject(value);

    Object.entries(flat).forEach(([key, val]) => {
      const path = key.split('.');
      const item = path.pop();
      if (!item) {
        throw new Error('item not found');
      }

      const nonTerminalPathParts = path;

      // TODO: update so that property can be an underscored item
      const itemParts = item.split('_');
      const attr = itemParts[0];
      const operator = itemParts[1];

      if (!operator) {
        throw new Error('must have operator');
      }

      const pre = nonTerminalPathParts.map(pathPart => `->'${pathPart}'`);

      addQueryBuilderWhereItem(
        qb,
        dbColumn,
        `${columnWithAlias}${pre}->>'${attr}'`,
        operator,
        val,
        columnWithAlias + key // Make this unique for this JSON path
      );
    });

    return qb;
  }

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

function flattenObject(obj: any) {
  const result: any = {};

  for (const outer in obj) {
    if (typeof obj[outer] == 'object' && obj[outer] !== null) {
      const flatObject = flattenObject(obj[outer]);
      for (const inner in flatObject) {
        result[outer + '.' + inner] = flatObject[inner];
      }
    } else {
      result[outer] = obj[outer];
    }
  }
  return result;
}
