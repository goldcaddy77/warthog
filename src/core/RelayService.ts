import { Service } from 'typedi';

import { BaseModel } from './BaseModel';
import { EncodingService } from './encoding';

export type Cursor = string;

export interface ConnectionEdge<E> {
  node: E;
  cursor: Cursor;
}

export interface ConnectionResult<E> {
  totalCount: number;
  edges: ConnectionEdge<E>[];
  pageInfo: PageInfo;
}

type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: Cursor;
  endCursor: Cursor;
};

export type RelayPageOptionsInput = {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
};

export type RelayFirstAfter = {
  first: number;
  after?: string;
};

export type RelayLastBefore = {
  last: number;
  before?: string;
};

export type RelayPageOptions = RelayFirstAfter | RelayLastBefore;

function isFirstAfter(pet: RelayFirstAfter | RelayLastBefore): pet is RelayFirstAfter {
  return (pet as RelayFirstAfter).first !== undefined;
}

@Service()
export class RelayService {
  encoding: EncodingService;

  constructor() {
    // TODO: use DI
    this.encoding = new EncodingService();
  }

  getPageInfo<E extends BaseModel>(
    items: E[],
    orderBy: string | string[],
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
    const order = this.getCursorOrderBy(orderBy);

    return {
      hasNextPage: items.length > limit,
      // Right now we assume there is a previous page if client specifies the cursor
      // typically a client will not specify a cursor on the first page and would otherwise
      hasPreviousPage: !!cursor,
      startCursor: this.getCursor(firstItem, order),
      endCursor: this.getCursor(lastItem, order)
    };
  }

  // Given an array of items, return the first and last
  // Note that this isn't as simple as returning the first and last as we've
  // asked for limit+1 items
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

  getCursor<E extends BaseModel>(record: E, orderBy: string | string[]): Cursor {
    if (!record) {
      throw new Error(`Record is not defined`);
    }
    if (!record.getString) {
      throw new Error(`Record is not a BaseModel: ${JSON.stringify(record, null, 2)}`);
    }

    orderBy = typeof orderBy === 'string' ? [orderBy] : orderBy;

    const payload = orderBy.map(orderItem => this.getCursorItem(record, orderItem)).join(',');

    return this.encoding.encode(payload);
  }

  getCursorItem<E extends BaseModel>(record: E, orderBy: string) {
    // orderItem: name_ASC
    const parts = orderBy.toString().split('_'); // ['name', 'ASC']
    const value = record.getString(parts[0]); // "Dan"

    // TODO: test strings with :, _ and special values
    return `${orderBy}:${value}`; // 'name_ASC:Dan'
  }

  getCursorOrderBy(orderBy?: string | string[]): string[] {
    if (!orderBy) {
      return ['id_ASC'];
    }

    const order = typeof orderBy === 'string' ? [orderBy] : orderBy;
    const hasIdSort = order.find(item => item.startsWith('id_'));

    // If we're not already sorting by ID, add this to sort to make cursor work
    // When the user-specified sort isn't unique
    return hasIdSort ? order : [...order, 'id_ASC'];
  }
}
