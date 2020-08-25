import { SelectQueryBuilder } from 'typeorm';

export type WhereOperator =
  | 'eq'
  | 'not'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte'
  | 'in'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'json';

type ExactWhereOperator = 'eq' | 'in';
type NumberWhereOperator = 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in';
type TextWhereOperator = 'eq' | 'contains' | 'startsWith' | 'endsWith' | 'in';
type DateGeneralWhereOperator = 'eq' | 'lt' | 'lte' | 'gt' | 'gte';

export type BooleanWhereOperator = ExactWhereOperator;
export type DateWhereOperator = DateGeneralWhereOperator;
export type DateOnlyWhereOperator = DateGeneralWhereOperator;
export type DateTimeWhereOperator = DateGeneralWhereOperator;
export type EmailWhereOperator = TextWhereOperator;
export type EnumWhereOperator = ExactWhereOperator;
export type FloatWhereOperator = NumberWhereOperator;
export type IdWhereOperator = ExactWhereOperator;
export type IntWhereOperator = NumberWhereOperator;
export type NumericWhereOperator = NumberWhereOperator;
export type StringWhereOperator = TextWhereOperator;

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
      return qb.andWhere(`${columnWithAlias} ILIKE :${parameterKey}`, {
        [parameterKey]: `%${value}%`
      });
    case 'startsWith':
      return qb.andWhere(`${columnWithAlias} ILIKE :${parameterKey}`, {
        [parameterKey]: `${value}%`
      });
    case 'endsWith':
      return qb.andWhere(`${columnWithAlias} ILIKE :${parameterKey}`, {
        [parameterKey]: `%${value}`
      });
    case 'json': {
      // It is not recommended to have snake_cased keys, but we should support them
      // Assume: value = { foo: { bar { my_baz_gt: 1 } } }
      const flat = flattenObject(value); // { "foo.bar.my_baz_gt": 1 }

      Object.entries(flat).forEach(([key, val]) => {
        // key = "foo.bar.my_baz_gt"
        // val = 1
        const path = key.split('.'); // ["foo", "bar", "my_baz_gt"]
        const leaf = path.pop(); // "my_baz_gt"
        const nonTerminalPathParts = path; // ["foo", "bar"]
        if (!leaf) {
          throw new Error(`Invalid JSON search criteria ${value}`);
        }

        // TODO: update so that property can be an underscored leaf
        const leafParts = leaf.split('_'); // ["my", "baz", "gt"]
        const operator = leafParts.pop(); // "gt"
        const attr = leafParts.join('_'); // my_baz

        if (!operator) {
          throw new Error(`Could not find operator in ${leaf}`);
        }

        if (operator === 'json') {
          throw new Error('Nested json filtering is not supported');
        }

        // TODO: add tests that:
        // go at least 3 levels deep
        // have snake_cased keys
        const pre = nonTerminalPathParts.map(pathPart => `->'${pathPart}'`).join(''); // ->'foo'->'bar'

        // Adds: "user"."json_field"->'foo'->'bar'->>'my_baz' > 1
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
