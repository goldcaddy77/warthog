const assert = require('assert').strict;

import { Service } from 'typedi';

import { EncodingService } from './encoding';

export type Cursor = string;

export interface ConnectionEdge<E> {
  node?: E;
  cursor?: Cursor;
}

export interface ConnectionResult<E> {
  totalCount?: number;
  edges?: ConnectionEdge<E>[];
  pageInfo?: PageInfo;
}

type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: Cursor;
  endCursor: Cursor;
};

export type RelayFirstAfter = {
  first: number; // this is required here so that we can do pagination
  after?: string;
};

export type RelayLastBefore = {
  last: number; // this is required here so that we can do pagination
  before?: string;
};

export type RelayPageOptions = RelayFirstAfter | RelayLastBefore;

export type SortColumn = string;
export type SortDirection = 'ASC' | 'DESC';
export type Sort = {
  column: SortColumn;
  direction: SortDirection;
};

type SortAndValue = [SortColumn, SortDirection, string | number];
type SortAndValueArray = Array<SortAndValue>;

interface Node {
  id?: string | number;
  getValue(field: string): string | number;
}

function isFirstAfter(pageType: RelayFirstAfter | RelayLastBefore): pageType is RelayFirstAfter {
  return (pageType as RelayLastBefore).last === undefined;
}

function isSort(sort: Sortable): sort is Sort {
  return (sort as Sort).column !== undefined;
}

function isSortArray(sort: Sortable): sort is Sort[] {
  const arr = sort as Sort[];
  return Array.isArray(arr) && arr.length > 0 && arr[0].column !== undefined;
}

type Sortable = string | string[] | Sort | Sort[] | undefined;

interface WhereExpression {
  [key: string]: string | number | null;
}

type WhereInput = {
  AND?: WhereInput[];
  OR?: WhereInput[];
} & WhereExpression;

@Service()
export class RelayService {
  encoding: EncodingService;

  constructor() {
    // TODO: use DI
    this.encoding = new EncodingService();
  }

  getPageInfo<E extends Node>(
    items: E[],
    sortable: Sortable,
    pageOptions: RelayPageOptions
  ): PageInfo {
    if (!items.length) {
      throw new Error('Items is empty');
    }
    let limit;
    let cursor;

    if (isFirstAfter(pageOptions)) {
      limit = pageOptions.first;
      cursor = pageOptions.after;
    } else {
      limit = pageOptions.last;
      cursor = pageOptions.before;
    }

    const [firstItem, lastItem] = this.firstAndLast<E>(items, limit);
    const sort = this.normalizeSort(sortable);

    return {
      hasNextPage: items.length > limit,
      // Right now we assume there is a previous page if client specifies the cursor
      // typically a client will not specify a cursor on the first page and would otherwise
      hasPreviousPage: !!cursor,
      startCursor: this.encodeCursor(firstItem, sort),
      endCursor: this.encodeCursor(lastItem, sort)
    };
  }

  // Given an array of items, return the first and last
  // Note that this isn't as simple as returning the first and last as we've
  // asked for limit+1 items (to know if there is a next page)
  firstAndLast<E>(items: E[], limit: number) {
    assert(items.length, 'Items cannot be empty');
    assert(limit > 0, 'Limit must be greater than 0');

    const onLastPage = items.length <= limit;
    const lastItemIndex = onLastPage ? items.length - 1 : limit - 1;
    const firstItem = items[0];
    const lastItem = items[lastItemIndex];

    return [firstItem, lastItem];
  }

  encodeCursor<E extends Node>(record: E, sortable: Sortable): Cursor {
    assert(record, 'Record is not defined');
    assert(record.getValue, `Record must be a Node: ${JSON.stringify(record, null, 2)}`);

    const sortArray = this.normalizeSort(sortable);
    const payload: Array<string | number> = sortArray.map(sort => record.getValue(sort.column));

    return this.encoding.encode(payload);
  }

  decodeCursor(cursor: Cursor): SortAndValueArray {
    return this.encoding.decode<SortAndValueArray>(cursor);
  }

  toSortArray(sort?: Sortable): Sort[] {
    if (!sort) {
      return [];
    } else if (isSortArray(sort)) {
      return sort;
    } else if (isSort(sort)) {
      return [sort];
    }

    // Takes sorts of the form ["name_DESC", "startAt_ASC"] and converts to relay service's internal
    // representation  [{ column: 'name', direction: 'DESC' }, { column: 'startAt', direction: 'ASC' }]
    const stringArray = Array.isArray(sort) ? sort : [sort];

    return stringArray.map((str: string) => {
      const sorts = str.split('_');

      return { column: sorts[0], direction: sorts[1] as SortDirection } as Sort;
    });
  }

  normalizeSort(sortable?: Sortable): Sort[] {
    const sort = this.toSortArray(sortable);

    if (!sort.length) {
      return [{ column: 'id', direction: 'ASC' }];
    }

    const hasIdSort = sort.find(item => item.column === 'id');

    // If we're not already sorting by ID, add this to sort to make cursor work
    // When the user-specified sort isn't unique
    if (!hasIdSort) {
      sort.push({ column: 'id', direction: 'ASC' });
    }
    return sort;
  }

  flipDirection(direction: SortDirection): SortDirection {
    return direction === 'ASC' ? 'DESC' : 'ASC';
  }

  effectiveOrder(sortable: Sortable, pageOptions: RelayPageOptions): Sort[] {
    const sorts = this.normalizeSort(sortable);
    if (isFirstAfter(pageOptions)) {
      return sorts;
    }

    return sorts.map(({ column, direction }) => {
      return { column, direction: this.flipDirection(direction) };
    });
  }

  effectiveOrderStrings(sortable: Sortable, pageOptions: RelayPageOptions): string[] {
    const sorts = this.effectiveOrder(sortable, pageOptions);
    return this.toSortStrings(sorts);
  }

  toSortStrings(sorts: Sort[]): string[] {
    return sorts.map((sort: Sort) => {
      return [sort.column, sort.direction].join('_');
    });
  }

  getFilters(sortable: Sortable, pageOptions: RelayPageOptions): WhereInput {
    // Ex: [ { column: 'createdAt', direction: 'ASC' }, { column: 'name', direction: 'DESC' }, { column: 'id', direction: 'ASC' } ]
    const cursor = isFirstAfter(pageOptions) ? pageOptions.after : pageOptions.before;
    if (!cursor) {
      return {};
    }

    const decodedCursor = this.decodeCursor(cursor); // Ex: ['1981-10-15T00:00:00.000Z', 'Foo', '1']
    const sorts = this.effectiveOrder(sortable, pageOptions);
    const comparisonOperator = (sortDirection: string) => (sortDirection == 'ASC' ? 'gt' : 'lt');

    /*
      Given:
        sorts = [['c', 'ASC'], ['b', 'DESC'], ['id', 'ASC']]
        decodedCursor = ['1981-10-15T00:00:00.000Z', 'Foo', '1']

      Output:
        {
          OR: [
            { createdAt_gt: '1981-10-15T00:00:00.000Z' },
            { createdAt_eq: '1981-10-15T00:00:00.000Z', name_lt: 'Foo' },
            { createdAt_eq: '1981-10-15T00:00:00.000Z', name_eq: 'Foo', id_gt: '1' }
          ]
        } 
     */
    return ({
      OR: sorts.map(({ column, direction }, i) => {
        const allOthersEqual = sorts
          .slice(0, i)
          .map((other, j) => ({ [`${other.column}_eq`]: decodedCursor[j] }));

        return Object.assign(
          {
            [`${column}_${comparisonOperator(direction)}`]: decodedCursor[i]
          },
          ...allOthersEqual
        );
      })
    } as unknown) as WhereInput;
  }
}
