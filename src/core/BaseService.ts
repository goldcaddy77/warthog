import { validate } from 'class-validator';
import { ArgumentValidationError } from 'type-graphql';
import { DeepPartial, getRepository, Repository } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

import { StandardDeleteResponse } from '../tgql';
import { addQueryBuilderWhereItem } from '../torm';

import { BaseModel } from '..';
import { StringMap, WhereInput } from './types';

export class BaseService<E extends BaseModel> {
  columnMap: StringMap;
  klass: string;

  // TODO: need to figure out why we couldn't type this as Repository<E>
  constructor(protected entityClass: any, protected repository: Repository<any>) {
    if (!entityClass) {
      throw new Error('BaseService requires an entity Class');
    }

    // TODO: This handles an issue with typeorm-typedi-extensions where it is unable to
    // Inject the proper repository
    if (!repository) {
      this.repository = getRepository(entityClass);
    }
    if (!repository) {
      throw new Error(`BaseService requires a valid repository, class ${entityClass}`);
    }

    // Need a mapping of camelCase field name to the modified case using the naming strategy.  For the standard
    // SnakeNamingStrategy this would be something like { id: 'id', stringField: 'string_field' }
    this.columnMap = this.repository.metadata.columns.reduce(
      (prev: StringMap, column: ColumnMetadata) => {
        prev[column.propertyPath] = column.databasePath;
        return prev;
      },
      {}
    );
    this.klass = this.repository.metadata.name.toLowerCase();
  }

  async find<W extends WhereInput>(
    where?: any,
    orderBy?: any, // Fix this
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<E[]> {
    let qb = this.repository.createQueryBuilder(this.klass);

    if (limit) {
      qb = qb.take(limit);
    }
    if (offset) {
      qb = qb.skip(offset);
    }

    if (fields) {
      // We always need to select ID or dataloaders will not function properly
      if (fields.indexOf('id') === -1) {
        fields.push('id');
      }
      // Querybuilder requires you to prefix all fields with the table alias.  It also requires you to
      // specify the field name using it's TypeORM attribute name, not the camel-cased DB column name
      const selection = fields.map(field => `${this.klass}.${field}`);
      qb = qb.select(selection);
    }
    if (orderBy) {
      // TODO: allow multiple sorts
      // See https://github.com/typeorm/typeorm/blob/master/docs/select-query-builder.md#adding-order-by-expression
      const parts = orderBy.toString().split('_');
      // TODO: ensure attr is one of the properties on the model
      const attr = parts[0];
      const direction: 'ASC' | 'DESC' = parts[1] as 'ASC' | 'DESC';

      qb = qb.orderBy(this.attrToDBColumn(attr), direction);
    }

    where = where || {};

    // Soft-deletes are filtered out by default, setting `deletedAt_all` is the only way to turn this off
    const hasDeletedAts = Object.keys(where).find(key => key.indexOf('deletedAt_') === 0);
    // If no deletedAt filters specified, hide them by default
    if (!hasDeletedAts) {
      // eslint-disable-next-line @typescript-eslint/camelcase
      where = { ...where, deletedAt_eq: null }; // Filter out soft-deleted items
    } else if (typeof where.deletedAt_all !== 'undefined') {
      // Delete this param so that it doesn't try to filter on the magic `all` param
      // Put this here so that we delete it even if `deletedAt_all: false` specified
      delete where.deletedAt_all;
    } else {
      // If we get here, the user has added a different deletedAt filter, like deletedAt_gt: <date>
      // do nothing because the specific deleted at filters will be added by processWhereOptions
    }

    if (Object.keys(where).length) {
      // where is of shape { userName_contains: 'a' }
      Object.keys(where).forEach(k => {
        const key = k as keyof W; // userName
        const parts = key.toString().split('_'); // ['userName', 'contains']
        const attr = parts[0]; // userName
        const operator = parts.length > 1 ? parts[1] : 'eq'; // contains

        qb = addQueryBuilderWhereItem(qb, attr, this.attrToDBColumn(attr), operator, where[key]);
      });
    }

    return qb.getMany();
  }

  async findOne<W extends Partial<E>>(where: Partial<E>): Promise<E> {
    const items = await this.find(where);
    if (!items.length) {
      throw new Error(`Unable to find ${this.entityClass.name} where ${JSON.stringify(where)}`);
    } else if (items.length > 1) {
      throw new Error(
        `Found ${items.length} ${this.entityClass.name}s where ${JSON.stringify(where)}`
      );
    }

    return items[0];
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
    return this.repository.save(obj, { reload: true });
  }

  async createMany(data: DeepPartial<E>[], userId: string): Promise<E[]> {
    data = data.map(item => {
      return { ...item, createdById: userId };
    });

    const results = this.repository.create(data);

    // Validate against the the data model
    // Without `skipMissingProperties`, some of the class-validator validations (like MinLength)
    // will fail if you don't specify the property
    for (const obj of results) {
      const errors = await validate(obj, { skipMissingProperties: true });
      if (errors.length) {
        // TODO: create our own error format that matches Mike B's format
        throw new ArgumentValidationError(errors);
      }
    }

    // TODO: remove any when this is fixed: https://github.com/Microsoft/TypeScript/issues/21592
    return this.repository.save(results, { reload: true });
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
    const found = await this.findOne(where);
    const idData = ({ id: found.id } as any) as DeepPartial<E>;
    const merged = this.repository.merge(new this.entityClass(), data, idData);

    // skipMissingProperties -> partial validation of only supplied props
    const errors = await validate(merged, { skipMissingProperties: true });
    if (errors.length) {
      throw new ArgumentValidationError(errors);
    }

    // TODO: remove `any` - getting issue here
    const result = await this.repository.save(merged);
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

    await this.repository.save(merged);

    return { id: found.id };
  }

  attrsToDBColumns = (attrs: string[]): string[] => {
    return attrs.map(this.attrToDBColumn);
  };

  attrToDBColumn = (attr: string): string => {
    return `"${this.klass}"."${this.columnMap[attr]}"`;
  };
}
