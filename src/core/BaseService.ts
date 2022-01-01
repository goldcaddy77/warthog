import { validate } from 'class-validator';
import { ArgumentValidationError } from 'type-graphql';
import { Container, Inject, Service } from 'typedi';
import {
  Brackets,
  DeepPartial,
  EntityManager,
  getRepository,
  Repository,
  SelectQueryBuilder
} from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { debug } from '../decorators';
import { MetadataStorage } from '../metadata';
import { StandardDeleteResponse } from '../tgql';
import { addQueryBuilderWhereItem } from '../torm';
import { ConnectionInputFields, GraphQLInfoService } from './GraphQLInfoService';
import {
  ConnectionResult,
  RelayFirstAfter,
  RelayLastBefore,
  RelayPageOptions,
  RelayService
} from './RelayService';
import { DateTimeString, IDType, StringMap } from './types';

export interface BaseOptions {
  manager?: EntityManager; // Allows consumers to pass in a TransactionManager
}

export type BaseOptionsExtended = BaseOptions | EntityManager;

export interface Node {
  id?: string | number;
  getValue(field: string): string | number;
}

interface WarthogSpecialModel {
  createdAt?: DateTimeString;
  createdById?: IDType;
  updatedAt?: DateTimeString;
  updatedById?: IDType;
  deletedAt?: DateTimeString;
  deletedById?: IDType;
  ownerId?: IDType;
}

Container.import([MetadataStorage]);

interface WhereFilterAttributes {
  [key: string]: string | number | null;
}

type WhereExpression = {
  AND?: Array<WhereExpression | {}>;
  OR?: Array<WhereExpression | {}>;
  id?: string | number;
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

@Service('BaseService')
export class BaseService<E extends Node> {
  manager: EntityManager;
  columnMap: StringMap;
  klass: string;
  relayService: RelayService;
  graphQLInfoService: GraphQLInfoService;

  @Inject('MetadataStorage') metadata!: MetadataStorage;

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

    // V3: we should use Warthog's metadata here instead of the TypeORM repository
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

  // V3: we shouln't be looking for specific column names, but rather at metadata-storage:specialType
  hasColumn(name: string) {
    return typeof this.columnMap[name] !== 'undefined';
  }

  getPageInfo(limit: number, offset: number, totalCount: number) {
    return {
      hasNextPage: totalCount > offset + limit,
      hasPreviousPage: offset > 0,
      limit,
      offset,
      totalCount
    };
  }

  async find(
    where: any = {}, // TODO: fix any
    orderBy?: string,
    limit?: number,
    offset?: number,
    fields?: string[],
    userId?: string,
    options?: BaseOptionsExtended
  ): Promise<E[]> {
    const manager = this.extractManager(options);

    const DEFAULT_LIMIT = 50;
    return this.buildFindQuery(
      where as WhereExpression,
      orderBy,
      { limit: limit || DEFAULT_LIMIT, offset },
      fields,
      userId,
      { manager }
    ).getMany();
  }

  @debug('base-service:findConnection')
  async findConnection(
    whereUserInput: any = {}, // V3: WhereExpression = {},
    orderBy?: string | string[],
    _pageOptions: RelayPageOptionsInput = {},
    fields?: ConnectionInputFields,
    userId?: string, // Allow this param so that when we overload we can pass the userId for filtering data to user's "world"
    options?: BaseOptionsExtended
  ): Promise<ConnectionResult<E>> {
    const manager = this.extractManager(options);

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
    const whereCombined = {
      AND: [whereUserInput, whereFromCursor]
    } as WhereExpression;

    const qb = this.buildFindQuery(
      whereCombined,
      this.relayService.effectiveOrderStrings(sorts, relayPageOptions),
      { limit: limit + 1 }, // We ask for 1 too many so that we know if there is an additional page
      requestedFields.selectFields,
      userId,
      { manager }
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
  buildFindQuery<W>(
    where: any = {}, // W | WhereExpression
    orderBy?: string | string[],
    pageOptions?: LimitOffset,
    fields?: string[],
    userId?: string, // Allow this param so that when we overload we can pass the userId for filtering data to user's "world"
    options?: BaseOptionsExtended
  ): SelectQueryBuilder<E> {
    const manager = this.extractManager(options);

    const DEFAULT_LIMIT = 50;
    let qb = manager.createQueryBuilder<E>(this.entityClass, this.klass);
    if (!pageOptions) {
      pageOptions = {
        limit: DEFAULT_LIMIT
      };
    }

    qb = qb.limit(pageOptions.limit || DEFAULT_LIMIT);

    if (pageOptions.offset) {
      qb = qb.offset(pageOptions.offset);
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
      if (!Array.isArray(orderBy)) {
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
    const hasDeletedAtFilter = Object.keys(where).find(key => key.indexOf('deletedAt_') === 0);

    // If there is no deletedAt column, don't add this default filter
    // TODO: don't just look at "deleteAt" column, look for metadata from a DeletedDate decorator
    if (!this.hasColumn('deletedAt')) {
      // Don't do anything
    } else if (!hasDeletedAtFilter) {
      // If no deletedAt filters specified, hide them by default
      // eslint-disable-next-line @typescript-eslint/camelcase
      (where as any).deletedAt_eq = null; // Filter out soft-deleted items
    } else if (typeof (where as any).deletedAt_all !== 'undefined') {
      // Delete this param so that it doesn't try to filter on the magic `all` param
      // Put this here so that we delete it even if `deletedAt_all: false` specified
      delete (where as any).deletedAt_all;
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
        const key = k; // userName_contains
        const parts = key.toString().split('_'); // ['userName', 'contains']
        const attr = parts[0]; // userName
        const operator = parts.length > 1 ? parts[1] : 'eq'; // ex: contains.  Default operator to equals

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

    return qb;
  }

  async findOne<W>(where: W, userId?: string, options?: BaseOptionsExtended): Promise<E> {
    const items = await this.find(
      where as any,
      undefined,
      undefined,
      undefined,
      undefined,
      userId,
      options
    );
    if (!items.length) {
      throw new Error(`Unable to find ${this.entityClass.name} where ${JSON.stringify(where)}`);
    } else if (items.length > 1) {
      throw new Error(
        `Found ${items.length} ${this.entityClass.name}s where ${JSON.stringify(where)}`
      );
    }

    return items[0];
  }

  extractManager(options?: BaseOptionsExtended) {
    if (!options) {
      return this.manager;
    }
    if (options instanceof EntityManager) {
      return options;
    }
    if (options.manager && options.manager instanceof EntityManager) {
      return options.manager;
    }

    return this.manager;
  }

  async create(data: DeepPartial<E>, userId: string, options?: BaseOptionsExtended): Promise<E> {
    const manager = this.extractManager(options);
    const createdByIdObject: WarthogSpecialModel = this.hasColumn('createdById')
      ? { createdById: userId }
      : {};
    const ownerIdObject: WarthogSpecialModel = this.hasColumn('ownerId') ? { ownerId: userId } : {};
    const entity = manager.create(this.entityClass, {
      ...data,
      ...createdByIdObject,
      ...ownerIdObject
    } as DeepPartial<E>);

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

  async createMany(
    data: DeepPartial<E>[],
    userId: string,
    options?: BaseOptionsExtended
  ): Promise<E[]> {
    const manager = this.extractManager(options);
    const createdByIdObject: WarthogSpecialModel = this.hasColumn('createdById')
      ? { createdById: userId }
      : {};
    const ownerIdObject: WarthogSpecialModel = this.hasColumn('ownerId') ? { ownerId: userId } : {};

    data = data.map(item => {
      return { ...item, ...createdByIdObject, ...ownerIdObject };
    });

    debug(`before create many: ${data.length}`);
    const results = manager.create(this.entityClass, data);
    debug('after create many');

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
  async update<W>(
    data: DeepPartial<E>,
    where: W,
    userId: string,
    options?: BaseOptionsExtended
  ): Promise<E> {
    const manager = this.extractManager(options);
    const found = await this.findOne(where, userId, options);
    const updatedByIdObject: WarthogSpecialModel = this.hasColumn('updatedById')
      ? { updatedById: userId }
      : {};
    const mergeData: DeepPartial<E> = { id: found.id, ...updatedByIdObject } as any;
    const entity = manager.merge<E>(this.entityClass, new this.entityClass(), data, mergeData);

    // skipMissingProperties -> partial validation of only supplied props
    const errors = await validate(entity, { skipMissingProperties: true });
    if (errors.length) {
      throw new ArgumentValidationError(errors);
    }

    const result = await manager.save<E>(entity);
    return manager.findOneOrFail(this.entityClass, result.id);
  }

  async delete(
    where: any,
    userId: string,
    options?: BaseOptionsExtended
  ): Promise<StandardDeleteResponse> {
    const manager = this.extractManager(options);

    // V3: TODO: we shouldn't look for the column name, we should see if they've decorated the
    // model with a DeletedDate decorator
    // If there is no deletedAt column, actually delete the record
    if (!this.hasColumn('deletedAt')) {
      const found = await manager.findOneOrFail<E>(this.entityClass, where);
      await manager.delete<E>(this.entityClass, where);
      return { id: String(found.id) };
    }

    const whereNotDeleted = {
      ...where,
      deletedAt: null
    };

    const found = await manager.findOneOrFail<E>(this.entityClass, whereNotDeleted as any);

    const deletedAtObject = this.hasColumn('deletedAt')
      ? { deletedAt: new Date().toISOString() }
      : {};
    const deletedByObject = this.hasColumn('deletedById') ? { deletedById: userId } : {};

    const data: WarthogSpecialModel = {
      ...deletedAtObject,
      ...deletedByObject
    };

    const idData = ({ id: found.id } as any) as DeepPartial<E>;
    const entity = manager.merge<E>(this.entityClass, new this.entityClass(), data as any, idData);

    await manager.save(entity as any);
    return { id: String(found.id) };
  }

  attrsToDBColumns = (attrs: string[]): string[] => {
    return attrs.map(this.attrToDBColumn);
  };

  attrToDBColumn = (attr: string): string => {
    return `"${this.klass}"."${this.columnMap[attr]}"`;
  };
}
