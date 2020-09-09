import { Service } from 'typedi';

import { BaseModel } from './BaseModel';
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

export type SortColumn = string;
export type SortDirection = 'ASC' | 'DESC';
export type Sort = {
  column: SortColumn;
  direction: SortDirection;
};

type SortAndValue = [SortColumn, SortDirection, string | number];
type SortAndValueArray = Array<SortAndValue>;

export type RelayPageOptions = RelayFirstAfter | RelayLastBefore;

function isFirstAfter(pageType: RelayFirstAfter | RelayLastBefore): pageType is RelayFirstAfter {
  return (pageType as RelayFirstAfter).after !== undefined;
}

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

  getPageInfo<E extends BaseModel>(
    items: E[],
    sortOrSortArray: Sort | Sort[],
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
    const sort = this.normalizeSort(sortOrSortArray);

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
    if (!items.length) {
      throw new Error('Items is empty');
    }

    const onLastPage = items.length <= limit;
    const lastItemIndex = onLastPage ? items.length - 1 : limit - 1;
    const firstItem = items[0];
    const lastItem = items[lastItemIndex];

    return [firstItem, lastItem];
  }

  encodeCursor<E extends BaseModel>(record: E, sortOrSortArray: Sort | Sort[]): Cursor {
    if (!record) {
      throw new Error(`Record is not defined`);
    }
    if (!record.getValue) {
      throw new Error(`Record is not a BaseModel: ${JSON.stringify(record, null, 2)}`);
    }

    const sortArray = this.normalizeSort(sortOrSortArray);

    const payload: SortAndValueArray = sortArray.map(sort => {
      // const value = record.getValue(sort.column); // `Dan`
      // return [sort.column, sort.direction as SortDirection, value]; // ['name', 'ASC', 'Dan']
      return record.getValue(sort.column);
    });

    return this.encoding.encode(payload);
  }

  decodeCursor(cursor: Cursor): SortAndValueArray {
    return this.encoding.decode<SortAndValueArray>(cursor);
  }

  toSortArray(sort?: Sort | Sort[]): Sort[] {
    if (!sort) {
      return [];
    }
    return Array.isArray(sort) ? sort : [sort];
  }

  normalizeSort(sortOrSortArray?: Sort | Sort[]): Sort[] {
    const sort = this.toSortArray(sortOrSortArray);

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

  normalizeStrings(strings?: string | string[]): string[] {
    return this.sortFromStrings(strings).map((sort: Sort) => {
      return [sort.column, sort.direction].join('_');
    });
  }

  // Takes sorts of the form ["name_DESC", "startAt_ASC"] and converts to relay service's internal
  // representation  [{ column: 'name', direction: 'DESC' }, { column: 'startAt', direction: 'ASC' }]
  sortFromStrings(stringOrStringArray: string | string[] = []): Sort[] {
    const stringArray = Array.isArray(stringOrStringArray)
      ? stringOrStringArray
      : [stringOrStringArray];

    const sorts: Sort[] = stringArray.map((str: string) => {
      const sorts = str.split('_');

      return { column: sorts[0], direction: sorts[1] as SortDirection };
    });

    return this.normalizeSort(sorts);
  }

  /*
    decodedCursor = ['three', 2, 7]
    order = [['c', 'ASC'], ['b', 'DESC'], ['id', 'ASC']]
    
    =>
    
    WHERE c > 'three' OR (c = 'three' AND b < 2) OR (c = 'three' AND b = 2 AND id > 7)
    */
  getFilters(orderBy: string | string[] | undefined, cursor: Cursor): WhereInput {
    const sorts = this.sortFromStrings(orderBy);
    const decodedCursor = this.decodeCursor(cursor);
    const comparisonOperator = (sortDirection: string) => (sortDirection == 'ASC' ? 'gt' : 'lt');

    /*
        e.g.

        decodedCursor = ['three', 2, 7]
        order = [['c', 'ASC'], ['b', 'DESC'], ['id', 'ASC']]

        =>

        WHERE c > 'three' OR (c = 'three' AND b < 2) OR (c = 'three' AND b = 2 AND id > 7)
        */

    return {
      OR: sorts.map(({ column, direction }, i) => {
        const allOthersEqual = sorts
          .slice(0, i)
          .map((other, j) => ({ [other.column]: decodedCursor[j] }));

        return Object.assign(
          {
            [`${column}_${comparisonOperator(direction)}`]: decodedCursor[i]
          },
          ...allOthersEqual
        );
      }) as any // TODO: fix
    };
  }
}
