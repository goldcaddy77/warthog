import { SelectQueryBuilder } from 'typeorm';

export function addQueryBuilderWhereItem<E>(
  qb: SelectQueryBuilder<E>,
  dbColumn: string,
  columnWithAlias: string,
  operator: string,
  value: any,
  tableName?: string
): SelectQueryBuilder<E> {
  // console.log(tableName);

  let qbReturn = qb;

  switch (operator) {
    case 'eq':
      if (value === null) {
        return qb.andWhere(`${columnWithAlias} IS NULL`);
      }
      if (typeof value === 'object') {
        const flat = flattenObject(value);
        console.log('\nflat', flat);

        Object.entries(flat).forEach(([key, value]) => {
          // const finder = columnWithAlias;
          const pathParts = key.split('.');
          const last = pathParts.pop();
          const rest = pathParts;

          // WHERE "user"."json_field"->>'ben_eq' = $1 AND "user"."json_field"->>'bar' = $2

          console.log('\nkey', key);
          console.log('\nvalue', value);
          console.log('\npathParts', pathParts);
          console.log('\nlast', last);
          console.log('\nrest', rest);

          // key ben_eq
          // value foo
          // pathParts []
          // last ben_eq
          // rest []
          // key foo.bar
          // value hello
          // pathParts [ 'foo' ]
          // last bar
          // rest [ 'foo' ]

          const pre = pathParts.map(item => `->'${item}'`);

          // return qb.andWhere(`${columnWithAlias}->'foo'->>'bar' = :${dbColumn}`, {

          qbReturn = qb.andWhere(
            `${columnWithAlias}${pre}->>'${last}' = :${columnWithAlias + key}`,
            {
              [columnWithAlias + key]: value
            }
          );
        });

        return qbReturn;
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
  const toReturn: any = {};

  for (const i in obj) {
    console.log('foo', i, obj);
    // if (!obj.hasOwnProperty(i)) continue;

    if (typeof obj[i] == 'object' && obj[i] !== null) {
      const flatObject = flattenObject(obj[i]);
      for (const x in flatObject) {
        // if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + '.' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = obj[i];
    }
  }
  return toReturn;
}
