import { validate } from 'class-validator';
import { ArgumentValidationError } from 'type-graphql';
import { DeepPartial, EntityManager, getRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

import { debug } from '../decorators';
import { StandardDeleteResponse } from '../tgql';
import { addQueryBuilderWhereItem } from '../torm';

import { BaseModel } from './';
import { StringMap } from './types';
import { isArray } from 'util';
import { RelayFirstAfter, RelayLastBefore, RelayService, RelayPageOptions } from './RelayService';
import { GraphQLInfoService, ConnectionInputFields } from './GraphQLInfoService';

export interface BaseOptions {
  manager?: EntityManager; // Allows consumers to pass in a TransactionManager
}

interface WhereExpression {
  [key: string]: string | number | null;
}

type WhereInput = {
  AND?: WhereInput[];
  OR?: WhereInput[];
} & WhereExpression;

export type LimitOffset = {
  limit: number;
  offset?: number;
};

export type PaginationOptions = LimitOffset | RelayPageOptions;

// function isFirstAfter(
//   pageType: PaginationOptions | RelayPageOptionsInput
// ): pageType is RelayFirstAfter {
//   return (pageType as RelayFirstAfter).first !== undefined;
// }

export type RelayPageOptionsInput = {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
};

function isLastBefore(
  pageType: PaginationOptions | RelayPageOptionsInput
): pageType is RelayLastBefore {
  return (pageType as RelayLastBefore).last !== undefined;
}

// function isLimitOffset(pageType: PaginationOptions): pageType is LimitOffset {
//   return (pageType as LimitOffset).limit !== undefined;
// }

export class BaseService<E extends BaseModel> {
  manager: EntityManager;
  columnMap: StringMap;
  klass: string;
  relayService: RelayService;
  graphQLInfoService: GraphQLInfoService;

  // TODO: any -> ObjectType<E> (or something close)
  // V3: Only ask for entityClass, we can get repository and manager from that
  constructor(protected entityClass: any, protected repository: Repository<E>) {
    if (!entityClass) {
      throw new Error('BaseService requires an entity Class');
    }

    // TODO: use DI
    this.relayService = new RelayService();
    this.graphQLInfoService = new GraphQLInfoService();

    // V3: remove the need to inject a repository, we simply need the entityClass and then we can do
    // everything we need to do.
    // For now, we'll keep the API the same so that there are no breaking changes
    this.manager = this.repository.manager;

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
    whereExpression: WhereExpression = {},
    orderBy?: string,
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<E[]> {
    // TODO: FEATURE - make the default limit configurable
    limit = limit ?? 20;
    return this.buildFindQuery<W>(whereExpression, orderBy, { limit, offset }, fields).getMany();
  }

  @debug('base-service:findConnection')
  async findConnection<W extends WhereInput>(
    whereUserInput: WhereExpression = {},
    orderBy?: string,
    _pageOptions: RelayPageOptionsInput = {},
    fields?: ConnectionInputFields
  ): Promise<any> {
    // TODO: FEATURE - make the default limit configurable
    const DEFAULT_LIMIT = 20;
    const { first, after, last, before } = _pageOptions;

    let relayPageOptions;
    let limit;
    let cursor;
    if (isLastBefore(_pageOptions)) {
      limit = (last || DEFAULT_LIMIT) + 1; // We ask for 1 too many so that we know if there is an additional page
      cursor = before;
      relayPageOptions = {
        last,
        before
      } as RelayLastBefore;
    } else {
      limit = (first || DEFAULT_LIMIT) + 1; // We ask for 1 too many so that we know if there is an additional page
      cursor = after;
      relayPageOptions = {
        first,
        after
      } as RelayFirstAfter;
    }

    const options = this.graphQLInfoService.connectionOptions(fields);
    const sorts = this.relayService.normalizeSort(orderBy);
    let whereFromCursor = {};
    if (cursor) {
      whereFromCursor = this.relayService.getFilters(orderBy, cursor);
    }
    const whereCombined: any = { AND: [whereUserInput, whereFromCursor] };

    const qb = this.buildFindQuery<W>(
      whereCombined,
      this.relayService.effectiveOrderStrings(sorts, relayPageOptions), // TODO: need to allow a more complex query shape for Relay wheres
      { limit },
      options.selectFields
    );

    let data;
    let totalCountOption = {};
    if (options.totalCount) {
      let totalCount;
      [data, totalCount] = await qb.getManyAndCount();
      totalCountOption = { totalCount };
    } else {
      data = await qb.getMany();
    }

    return {
      ...totalCountOption,
      edges: data.map((item: E) => {
        return {
          node: item,
          cursor: this.relayService.encodeCursor(item, sorts)
        };
      }),
      pageInfo: this.relayService.getPageInfo(data, sorts, relayPageOptions)
    };
  }

  @debug('base-service:buildFindQuery')
  private buildFindQuery<W extends WhereInput>(
    where: WhereInput,
    orderBy?: string | string[],
    pageOptions?: LimitOffset,
    fields?: string[]
  ): SelectQueryBuilder<E> {
    const DEFAULT_LIMIT = 20;
    let qb = this.manager.createQueryBuilder<E>(this.entityClass, this.klass);
    if (!pageOptions) {
      pageOptions = {
        limit: DEFAULT_LIMIT
      };
    }

    qb = qb.take(pageOptions.limit || DEFAULT_LIMIT);

    if (pageOptions.offset) {
      qb = qb.skip(pageOptions.offset);
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

    // V3: pull orderBy out of decodedCursor and make sure it matches the input
    // if(decodedCursor) {}

    if (orderBy) {
      if (!isArray(orderBy)) {
        orderBy = [orderBy];
      }

      orderBy.forEach((orderByItem: string) => {
        // TODO: allow multiple sorts
        // See https://github.com/typeorm/typeorm/blob/master/docs/select-query-builder.md#adding-order-by-expression
        const parts = orderByItem.toString().split('_');
        // TODO: ensure attr is one of the properties on the model
        const attr = parts[0];
        const direction: 'ASC' | 'DESC' = parts[1] as 'ASC' | 'DESC';

        qb = qb.orderBy(this.attrToDBColumn(attr), direction);
      });
    }

    // Soft-deletes are filtered out by default, setting `deletedAt_all` is the only way to turn this off
    const hasDeletedAts = Object.keys(where).find(key => key.indexOf('deletedAt_') === 0);
    // If no deletedAt filters specified, hide them by default
    if (!hasDeletedAts) {
      // eslint-disable-next-line @typescript-eslint/camelcase
      where.deletedAt_eq = null; // Filter out soft-deleted items
    } else if (typeof where.deletedAt_all !== 'undefined') {
      // Delete this param so that it doesn't try to filter on the magic `all` param
      // Put this here so that we delete it even if `deletedAt_all: false` specified
      delete where.deletedAt_all;
    } else {
      // If we get here, the user has added a different deletedAt filter, like deletedAt_gt: <date>
      // do nothing because the specific deleted at filters will be added by processWhereOptions
    }

    if (Object.keys(where).length) {
      const { AND, OR, ...rest } = where;
      // Look for AND, OR, ...rest
      // Put brackets around each of them and AND them

      // where is of shape { userName_contains: 'a' }
      Object.keys(where).forEach((k: string, i: number) => {
        const paramKey = BaseService.buildParamKey(i);
        const key = k as keyof W; // userName_contains
        const parts = key.toString().split('_'); // ['userName', 'contains']
        const attr = parts[0]; // userName
        const operator = parts.length > 1 ? parts[1] : 'eq'; // contains

        qb = addQueryBuilderWhereItem(
          qb,
          paramKey,
          this.attrToDBColumn(attr),
          operator,
          where[key]
        );
      });
    }

    return qb;
  }

  async findOne(where: WhereExpression): Promise<E> {
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

  async create(data: DeepPartial<E>, userId: string, options?: BaseOptions): Promise<E> {
    const manager = options?.manager ?? this.manager;
    const entity = manager.create(this.entityClass, { ...data, createdById: userId });

    // Validate against the the data model
    // Without `skipMissingProperties`, some of the class-validator validations (like MinLength)
    // will fail if you don't specify the property
    const errors = await validate(entity, { skipMissingProperties: true });
    if (errors.length) {
      // TODO: create our own error format
      throw new ArgumentValidationError(errors);
    }

    // TODO: remove any when this is fixed: https://github.com/Microsoft/TypeScript/issues/21592
    // TODO: Fix `any`
    return manager.save(entity as any, { reload: true });
  }

  async createMany(data: DeepPartial<E>[], userId: string, options?: BaseOptions): Promise<E[]> {
    const manager = options?.manager ?? this.manager;

    data = data.map(item => {
      return { ...item, createdById: userId };
    });

    const results = manager.create(this.entityClass, data);

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

    return manager.save(results, { reload: true });
  }

  // TODO: There must be a more succinct way to:
  //   - Test the item exists
  //   - Update
  //   - Return the full object
  // NOTE: assumes all models have a unique `id` field
  // W extends Partial<E>
  async update<W extends any>(
    data: DeepPartial<E>,
    where: WhereExpression,
    userId: string,
    options?: BaseOptions
  ): Promise<E> {
    const manager = options?.manager ?? this.manager;
    const found = await this.findOne(where);
    const mergeData = ({ id: found.id, updatedById: userId } as any) as DeepPartial<E>;
    const entity = manager.merge<E>(this.entityClass, new this.entityClass(), data, mergeData);

    // skipMissingProperties -> partial validation of only supplied props
    const errors = await validate(entity, { skipMissingProperties: true });
    if (errors.length) {
      throw new ArgumentValidationError(errors);
    }

    const result = await manager.save<E>(entity);
    return manager.findOneOrFail(this.entityClass, result.id);
  }

  async delete<W extends any>(
    where: W,
    userId: string,
    options?: BaseOptions
  ): Promise<StandardDeleteResponse> {
    const manager = options?.manager ?? this.manager;

    const data = {
      deletedAt: new Date().toISOString(),
      deletedById: userId
    };

    const found = await manager.findOneOrFail<E>(this.entityClass, where as any);
    const idData = ({ id: found.id } as any) as DeepPartial<E>;
    const entity = manager.merge<E>(this.entityClass, new this.entityClass(), data as any, idData);

    await manager.save(entity as any);
    return { id: found.id };
  }

  attrsToDBColumns = (attrs: string[]): string[] => {
    return attrs.map(this.attrToDBColumn);
  };

  attrToDBColumn = (attr: string): string => {
    return `"${this.klass}"."${this.columnMap[attr]}"`;
  };

  static buildParamKey = (i: number): string => `param${i}`;
}
