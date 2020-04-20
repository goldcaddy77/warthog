import { Service } from 'typedi';
import { BaseModel } from './BaseModel';

export interface ConnectionEdge<E> {
  node: E;
  cursor: string;
}

export interface ConnectionResult<E> {
  totalCount: number;
  edges: ConnectionEdge<E>[];
  pageInfo: PageInfo;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

@Service()
export class RelayService {
  getPageInfo<E extends BaseModel>(
    items: E[],
    orderBy: string | string[],
    limit: number,
    offset: number
  ): PageInfo {
    if (!items.length) {
      throw new Error('Items is empty');
    }

    orderBy = typeof orderBy === 'string' ? [orderBy] : orderBy;

    const [firstItem, lastItem] = this.getFirstAndLast<E>(items, limit);

    return {
      hasNextPage: items.length > limit,
      hasPreviousPage: offset > 0,
      startCursor: this.getCursor(firstItem, orderBy),
      endCursor: this.getCursor(lastItem, orderBy)
    };
  }

  getFirstAndLast<E>(items: E[], limit: number) {
    if (!items.length) {
      throw new Error('Items is empty');
    }

    // We ask for one more record than we need to see if there is a "next page"
    const onLastPage = items.length <= limit;
    const lastItemIndex = onLastPage ? items.length - 1 : limit - 1;
    const firstItem = items[0];
    const lastItem = items[lastItemIndex];

    return [firstItem, lastItem];
  }

  getCursor<E extends BaseModel>(record: E, orderBy: string | string[], skipEncoding = false) {
    if (!record) {
      throw new Error(`Record is not defined`);
    }
    if (!record.getString) {
      throw new Error(`Record is not a BaseModel: ${JSON.stringify(record, null, 2)}`);
    }

    orderBy = typeof orderBy === 'string' ? [orderBy] : orderBy;

    const payload = orderBy
      .map(orderItem => {
        const parts = orderItem.toString().split('_');
        const attr = parts[0];

        const value = record.getString(attr);
        // TODO: should I encode whether they asked for ASC/DESC, this would make the cursor more pure, but likely unnecessary
        // const direction: 'ASC' | 'DESC' = parts[1] as 'ASC' | 'DESC';

        return `${orderItem}:${value}`;
      })
      .join(',');

    return skipEncoding ? payload : `BASE64 ${payload}`;
  }

  getCursorOrderBy(orderBy?: string) {
    if (!orderBy) {
      return ['id_ASC'];
    } else if (orderBy.startsWith('id_')) {
      return [orderBy];
    } else {
      return [orderBy, 'id_ASC'];
    }
  }
}
