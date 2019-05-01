import { Equal, FindOperator, In, IsNull, LessThan, Like, MoreThan, Not } from 'typeorm';

export function getFindOperator(key: string, value: any): [string, FindOperator<any>] {
  const parts = key.toString().split('_');
  const attr = parts[0];
  const operator = parts.length > 1 ? parts[1] : 'eq';

  switch (operator) {
    case 'eq':
      if (value === null) {
        return [attr, IsNull()];
      }
      return [attr, Equal(value)];
    case 'not':
      return [attr, Not(value)];
    case 'lt':
      return [attr, LessThan(value)];
    case 'lte':
      return [attr, Not(MoreThan(value))];
    case 'gt':
      return [attr, MoreThan(value)];
    case 'gte':
      return [attr, Not(LessThan(value))];
    case 'in':
      return [attr, In(value)];
    case 'contains':
      return [attr, Like(`%${value}%`)];
    case 'startsWith':
      return [attr, Like(`${value}%`)];
    case 'endsWith':
      return [attr, Like(`%${value}`)];
    default:
      throw new Error(`Can't find operator ${operator}`);
  }
}
