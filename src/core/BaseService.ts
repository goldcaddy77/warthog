import { validate } from 'class-validator';
import { ArgumentValidationError } from 'type-graphql';
import {
  Brackets,
  DeepPartial,
  EntityManager,
  getRepository,
  QueryBuilder,
  ReplicationMode,
  Repository,
  SelectQueryBuilder
} from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import * as Debug from 'debug';

import { debug } from '../decorators';
import { StandardDeleteResponse } from '../tgql';
import { addQueryBuilderWhereItem } from '../torm';

import { BaseModel } from './';
import { StringMap, WhereInput } from './types';
import { isArray } from 'util';
import {
  RelayFirstAfter,
  RelayLastBefore,
  RelayService,
  RelayPageOptions,
  ConnectionResult
} from './RelayService';
import { GraphQLInfoService, ConnectionInputFields } from './GraphQLInfoService';
import { logger } from './logger';

const debugStatement = Debug('warthog:base-service');

export interface BaseOptions {
  manager?: EntityManager; // Allows consumers to pass in a TransactionManager
}

export interface AdvancedFindOptions {
  replicationMode?: ReplicationMode;
}

interface WhereFilterAttributes {
  [key: string]: string | number | null;
}

type WhereExpression = {
  AND?: WhereExpression[];
  OR?: WhereExpression[];
} & WhereFilterAttributes;

export type LimitOffset = {
  limit: number;
  offset?: number;
};

export type PaginationOptions = LimitOffset | RelayPageOptions;

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

    // TODO: This handles an issue with typeorm-typedi-extensions where it is unable to
    // Inject the proper repository
    if (!repository) {
      console.warn(`we're generating the repository from scratch...`);
      this.repository = getRepository(entityClass);
    }
    if (!repository) {
      throw new Error(`BaseService requires a valid repository, class ${entityClass}`);
    }

    // V3: remove the need to inject a repository, we simply need the entityClass and then we can do
    // everything we need to do.
    // For now, we'll keep the API the same so that there are no breaking changes
    this.manager = this.repository.manager;

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

  @debug('base-service:find')
  async find<W extends WhereInput>(
    where?: any, // V3: WhereExpression = {},
    orderBy?: string,
    limit?: number,
    offset?: number,
    fields?: string[],
    options: AdvancedFindOptions = {}
  ): Promise<E[]> {
    // TODO: FEATURE - make the default limit configurable
    limit = limit ?? 20;
    debugStatement('find:buildQuery');
    const qb = this.buildFindQuery<W>(where, orderBy, { limit, offset }, fields, options);
    try {
      debugStatement('find:gettingMany');
      const records = await qb.getMany();
      debugStatement('find:end');
      return records;
    } catch (e) {
      debugStatement('find:error');
      logger.error('failed on getMany', e);
      throw e;
    } finally {
      this.cleanUpQueryBuilder(qb);
    }
  }

  @debug('base-service:findConnection')
  async findConnection<W extends WhereInput>(
    whereUserInput: any = {}, // V3: WhereExpression = {},
    orderBy?: string | string[],
    _pageOptions: RelayPageOptionsInput = {},
    fields?: ConnectionInputFields,
    options: AdvancedFindOptions = {}
  ): Promise<ConnectionResult<E>> {
    // TODO: if the orderby items aren't included in `fields`, should we automatically include?

    // TODO: FEATURE - make the default limit configurable
    const DEFAULT_LIMIT = 50;
    const { first, after, last, before } = _pageOptions;

    let relayPageOptions;
    let limit;
    let cursor;
    if (isLastBefore(_pageOptions)) {
      limit = last || DEFAULT_LIMIT;
      cursor = before;
      relayPageOptions = {
        last: limit,
        before
      } as RelayLastBefore;
    } else {
      limit = first || DEFAULT_LIMIT;
      cursor = after;
      relayPageOptions = {
        first: limit,
        after
      } as RelayFirstAfter;
    }

    const requestedFields = this.graphQLInfoService.connectionOptions(fields);
    const sorts = this.relayService.normalizeSort(orderBy);
    let whereFromCursor = {};
    if (cursor) {
      whereFromCursor = this.relayService.getFilters(orderBy, relayPageOptions);
    }
    const whereCombined: any = { AND: [whereUserInput, whereFromCursor] };

    const qb = this.buildFindQuery<W>(
      whereCombined,
      this.relayService.effectiveOrderStrings(sorts, relayPageOptions),
      { limit: limit + 1 }, // We ask for 1 too many so that we know if there is an additional page
      requestedFields.selectFields,
      options
    );

    let rawData;
    let totalCountOption = {};
    if (requestedFields.totalCount) {
      let totalCount;
      [rawData, totalCount] = await qb.getManyAndCount();
      totalCountOption = { totalCount };
    } else {
      rawData = await qb.getMany();
    }

    this.cleanUpQueryBuilder(qb);

    // If we got the n+1 that we requested, pluck the last item off
    const returnData = rawData.length > limit ? rawData.slice(0, limit) : rawData;

    return {
      ...totalCountOption,
      edges: returnData.map((item: E) => {
        return {
          node: item,
          cursor: this.relayService.encodeCursor(item, sorts)
        };
      }),
      pageInfo: this.relayService.getPageInfo(rawData, sorts, relayPageOptions)
    };
  }

  @debug('base-service:buildFindQuery')
  buildFindQuery<W extends WhereInput>(
    where: WhereExpression = {},
    orderBy?: string | string[],
    pageOptions?: LimitOffset,
    fields?: string[],
    options: AdvancedFindOptions = {}
  ): SelectQueryBuilder<E> {
    try {
      const DEFAULT_LIMIT = 50;
      let qb = this.manager.connection.createQueryBuilder<E>(this.entityClass, this.klass);
      if (options.replicationMode) {
        const queryRunner = this.manager.connection.createQueryRunner(options.replicationMode);
        qb.setQueryRunner(queryRunner);
        (qb as any).warthogQueryRunnerOverride = queryRunner;
      }

      //
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

      if (orderBy) {
        if (!isArray(orderBy)) {
          orderBy = [orderBy];
        }

        orderBy.forEach((orderByItem: string) => {
          const parts = orderByItem.toString().split('_');
          // TODO: ensure attr is one of the properties on the model
          const attr = parts[0];
          const direction: 'ASC' | 'DESC' = parts[1] as 'ASC' | 'DESC';

          qb = qb.addOrderBy(this.attrToDBColumn(attr), direction);
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

      // Keep track of a counter so that TypeORM doesn't reuse our variables that get passed into the query if they
      // happen to reference the same column
      const paramKeyCounter = { counter: 0 };
      const processWheres = (
        qb: SelectQueryBuilder<E>,
        where: WhereFilterAttributes
      ): SelectQueryBuilder<E> => {
        // where is of shape { userName_contains: 'a' }
        Object.keys(where).forEach((k: string) => {
          const paramKey = `param${paramKeyCounter.counter}`;
          // increment counter each time we add a new where clause so that TypeORM doesn't reuse our input variables
          paramKeyCounter.counter = paramKeyCounter.counter + 1;
          const key = k as keyof W; // userName_contains
          const parts = key.toString().split('_'); // ['userName', 'contains']
          const attr = parts[0]; // userName
          const operator = parts.length > 1 ? parts[1] : 'eq'; // contains

          return addQueryBuilderWhereItem(
            qb,
            paramKey,
            this.attrToDBColumn(attr),
            operator,
            where[key]
          );
        });
        return qb;
      };

      // WhereExpression comes in the following shape:
      // {
      //   AND?: WhereInput[];
      //   OR?: WhereInput[];
      //   [key: string]: string | number | null;
      // }
      const processWhereInput = (
        qb: SelectQueryBuilder<E>,
        where: WhereExpression
      ): SelectQueryBuilder<E> => {
        const { AND, OR, ...rest } = where;

        if (AND && AND.length) {
          const ands = AND.filter(value => JSON.stringify(value) !== '{}');
          if (ands.length) {
            qb.andWhere(
              new Brackets(qb2 => {
                ands.forEach((where: WhereExpression) => {
                  if (Object.keys(where).length === 0) {
                    return; // disregard empty where objects
                  }
                  qb2.andWhere(
                    new Brackets(qb3 => {
                      processWhereInput(qb3 as SelectQueryBuilder<any>, where);
                      return qb3;
                    })
                  );
                });
              })
            );
          }
        }

        if (OR && OR.length) {
          const ors = OR.filter(value => JSON.stringify(value) !== '{}');
          if (ors.length) {
            qb.andWhere(
              new Brackets(qb2 => {
                ors.forEach((where: WhereExpression) => {
                  if (Object.keys(where).length === 0) {
                    return; // disregard empty where objects
                  }

                  qb2.orWhere(
                    new Brackets(qb3 => {
                      processWhereInput(qb3 as SelectQueryBuilder<any>, where);
                      return qb3;
                    })
                  );
                });
              })
            );
          }
        }

        if (rest) {
          processWheres(qb, rest);
        }
        return qb;
      };

      if (Object.keys(where).length) {
        processWhereInput(qb, where);
      }

      debugStatement('buildFindQuery:end');
      return qb;
    } catch (e) {
      logger.error(`Hit this error while building find query`, e);
      throw e;
    }
  }

  async findOne<W>(
    where: W // V3: WhereExpression
  ): Promise<E> {
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
    // const entity = manager.create(this.entityClass, { ...data, createdById: userId });
    const entity = manager.create(this.entityClass, { ...data, createdById: userId } as DeepPartial<
      E
    >);

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
    where: W, // V3: WhereExpression,
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

  async delete<W extends object>(
    where: W,
    userId: string,
    options?: BaseOptions
  ): Promise<StandardDeleteResponse> {
    const manager = options?.manager ?? this.manager;

    const data = {
      deletedAt: new Date().toISOString(),
      deletedById: userId
    };

    const whereNotDeleted = {
      ...where,
      deletedAt: null
    };

    const found = await manager.findOneOrFail<E>(this.entityClass, whereNotDeleted as any);
    const idData = ({ id: found.id } as any) as DeepPartial<E>;
    const entity = manager.merge<E>(this.entityClass, new this.entityClass(), data as any, idData);

    await manager.save(entity as any);
    return { id: found.id };
  }

  // This is really ugly.  Shouldn't be attaching to the querybuilder, but need to keep track of whether this
  // instance of the queryBuilder was created with a custom query runner so that it can be cleaned up
  cleanUpQueryBuilder(qb: QueryBuilder<E>) {
    // console.log(qb);
    if ((qb as any).warthogQueryRunnerOverride) {
      (qb as any).warthogQueryRunnerOverride.release();
    }
  }

  attrsToDBColumns = (attrs: string[]): string[] => {
    return attrs.map(this.attrToDBColumn);
  };

  attrToDBColumn = (attr: string): string => {
    return `"${this.klass}"."${this.columnMap[attr]}"`;
  };
}
