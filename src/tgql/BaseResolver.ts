import { validate } from 'class-validator';
import { ArgumentValidationError } from 'type-graphql';
import {
  DeepPartial,
  Equal,
  FindManyOptions,
  FindOperator,
  In,
  IsNull,
  LessThan,
  Like,
  MoreThan,
  Not,
  Repository
} from 'typeorm';

import { BaseObject, WhereInput } from '../core';
import { StandardDeleteResponse } from './DeleteResponse';

export class BaseResolver<E extends BaseObject> {
  // TODO: need to figure out why we couldn't type this as Repository<E>
  constructor(protected entityClass: any, protected repository: Repository<any>) {}

  async find<W extends WhereInput>(
    where?: any,
    orderBy?: any, // Fix this
    limit?: number,
    offset?: number
  ): Promise<E[]> {
    const findOptions: FindManyOptions = {};
    if (limit) {
      findOptions.take = limit;
    }
    if (offset) {
      findOptions.skip = offset;
    }
    if (orderBy) {
      // TODO: allow multiple sorts
      const parts = orderBy.toString().split('_');
      const attr = parts[0];
      const direction: 'ASC' | 'DESC' = parts[1] as 'ASC' | 'DESC';
      // TODO: ensure key is one of the properties on the model
      findOptions.order = {
        [attr]: direction
      };
    }

    // Soft-deletes are filtered out by default, setting `deletedAt_all` is the only way to
    // turn this off
    where = where || {};
    // TODO: Bug: does not support deletedAt_gt: "2000-10-10" or deletedAt_not: null
    if (!where.deletedAt_all) {
      where = { ...where, deletedAt_eq: null }; // Filter out soft-deleted items
    }

    // Delete this param so that it doesn't try to filter on the magic `all` param
    // Put this here so that we delete it even if `deletedAt_all: false` specified
    delete where.deletedAt_all;

    findOptions.where = this.processWhereOptions<W>(where);

    return this.repository.find(findOptions);
  }

  // TODO: fix - W extends Partial<E>
  async findOne<W extends { [key: string]: any }>(where: W): Promise<E> {
    where.deletedAt_eq = null; // Filter out soft-deleted items

    return this.repository.findOneOrFail(where);
  }

  async create(data: DeepPartial<E>, userId: string): Promise<E> {
    (data as any).createdById = userId; // TODO: fix any

    const results = this.repository.create([data]);
    const obj = results[0];

    // Validate against the the data model
    // Without `skipMissingProperties`, some of the class-validator validations (like MinLength)
    // will fail if you don't specify the property
    const errors = await validate(obj, { skipMissingProperties: true });
    if (errors.length) {
      // TODO: create our own error format that matches Mike B's format
      throw new ArgumentValidationError(errors);
    }

    // TODO: remove any when this is fixed: https://github.com/Microsoft/TypeScript/issues/21592
    return this.repository.save(obj as any, { reload: true });
  }

  // TODO: There must be a more succinct way to:
  //   - Test the item exists
  //   - Update
  //   - Return the full object
  // NOTE: assumes all models have a unique `id` field
  // W extends Partial<E>
  async update<W extends any>(data: DeepPartial<E>, where: W, userId: string): Promise<E> {
    (data as any).updatedById = userId; // TODO: fix any

    // const whereOptions = this.pullParamsFromClass(where);
    const found = await this.repository.findOneOrFail(where);
    const idData = ({ id: found.id } as any) as DeepPartial<E>;
    const merged = this.repository.merge(new this.entityClass(), data, idData);

    // skipMissingProperties -> partial validation of only supplied props
    const errors = await validate(merged, { skipMissingProperties: true });
    if (errors.length) {
      throw new ArgumentValidationError(errors);
    }

    // TODO: remove `any` - getting issue here
    const result = await this.repository.save(merged as any);
    return this.repository.findOneOrFail({ where: { id: result.id } });
  }

  async delete<W extends any>(where: W, userId: string): Promise<StandardDeleteResponse> {
    const data = {
      deletedAt: new Date().toISOString(),
      deletedById: userId
    };

    const found = await this.repository.findOneOrFail(where);
    const idData = ({ id: found.id } as any) as DeepPartial<E>;
    const merged = this.repository.merge(new this.entityClass(), data as any, idData);

    // TODO: remove `any` - getting issue here
    await this.repository.save(merged as any);

    return { id: where.id };
  }

  // TODO: boolean logic - AND, OR, NOT
  // extends WhereInput
  processWhereOptions<W extends any>(where: W) {
    const whereOptions: { [key: string]: FindOperator<any> } = {};
    Object.keys(where).forEach(k => {
      const key = k as keyof W;
      if (key === 'AND' || key === 'OR' || key === 'not') {
        throw new Error('Boolean logic not yet supported');
      }
      const [attr, operator] = getFindOperator(key, where[key]);
      whereOptions[attr] = operator;
    });
    return whereOptions;
  }
}

function getFindOperator(key: string, value: any): [string, FindOperator<any>] {
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
