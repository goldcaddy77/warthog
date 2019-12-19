import { SelectQueryBuilder } from 'typeorm';

export function addQueryBuilderWhereItem<E>(
  qb: SelectQueryBuilder<E>, // query builder will be mutated (chained) in this function
  parameterKey: string, // Paremeter key used in query builder
  columnWithAlias: string, // ex. "user"."name"
  operator: string, // ex. eq
  value: any
): SelectQueryBuilder<E> {
  switch (operator) {
    case 'eq':
      if (value === null) {
        return qb.andWhere(`${columnWithAlias} IS NULL`);
      }
      return qb.andWhere(`${columnWithAlias} = :${parameterKey}`, { [parameterKey]: value });
    case 'not':
      return qb.andWhere(`${columnWithAlias} != :${parameterKey}`, { [parameterKey]: value });
    case 'lt':
      return qb.andWhere(`${columnWithAlias} < :${parameterKey}`, { [parameterKey]: value });
    case 'lte':
      return qb.andWhere(`${columnWithAlias} <= :${parameterKey}`, { [parameterKey]: value });
    case 'gt':
      return qb.andWhere(`${columnWithAlias} > :${parameterKey}`, { [parameterKey]: value });
    case 'gte':
      return qb.andWhere(`${columnWithAlias} >= :${parameterKey}`, { [parameterKey]: value });
    case 'in':
      // IN (:... is the syntax for exploding array params into (?, ?, ?) in QueryBuilder
      return qb.andWhere(`${columnWithAlias} IN (:...${parameterKey})`, { [parameterKey]: value });
    case 'contains':
      return qb.andWhere(`LOWER(${columnWithAlias}) LIKE :${parameterKey}`, {
        [parameterKey]: `%${value}%`
      });
    case 'startsWith':
      return qb.andWhere(`LOWER(${columnWithAlias}) LIKE :${parameterKey}`, {
        [parameterKey]: `${value}%`
      });
    case 'endsWith':
      return qb.andWhere(`LOWER(${columnWithAlias}) LIKE :${parameterKey}`, {
        [parameterKey]: `%${value}`
      });
    case 'json': {
      // Assume: value = { foo: { bar { baz_gt: 1 } } }
      const flat = flattenObject(value); // { "foo.bar.baz_gt": 1 }

      Object.entries(flat).forEach(([key, val]) => {
        // key = "foo.bar.baz_gt"
        // val = 1
        const path = key.split('.'); // ["foo", "bar", "baz_gt"]
        const item = path.pop(); // "baz_gt"
        const nonTerminalPathParts = path; // ["foo", "bar"]
        if (!item) {
          throw new Error('item not found');
        }

        // TODO: update so that property can be an underscored item
        const itemParts = item.split('_'); // ["baz", "gt"]
        const attr = itemParts[0]; // "baz"
        const operator = itemParts[1]; // "gt"

        if (!operator) {
          throw new Error('must have operator');
        }

        // TODO: test at least 3 levels deep
        const pre = nonTerminalPathParts.map(pathPart => `->'${pathPart}'`).join(''); // ->'foo'->'bar'

        // Adds: "user"."json_field"->'foo'->'bar'->>'baz' > 1
        addQueryBuilderWhereItem(
          qb,
          columnWithAlias + key, // Make sure parameterKey used here is unique so that it doesn't get value from previous "where"
          `${columnWithAlias}${pre}->>'${attr}'`,
          operator,
          val
        );
      });

      return qb;
    }
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
