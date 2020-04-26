// import { GraphQLResolveInfo } from 'graphql';
import * as graphqlFields from 'graphql-fields';

import { Service } from 'typedi';

// DRY this up and move somewhere with copies in RelayService
type Cursor = string;

export type ConnectionInputFields = {
  totalCount?: number;
  edges?: {
    node?: object;
    cursor?: Cursor;
  };
  pageInfo?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: Cursor;
    endCursor?: Cursor;
  };
};

export interface Node {
  [key: string]: any;
}

@Service()
export class GraphQLInfoService {
  getFields(info: any): ConnectionInputFields {
    return graphqlFields(info);
  }

  connectionOptions(fields?: ConnectionInputFields) {
    if (!fields) {
      return {
        selectFields: [],
        totalCount: false,
        endCursor: false,
        startCursor: '',
        edgeCursors: ''
      };
    }

    return {
      selectFields: this.baseFields(fields?.edges?.node),
      totalCount: isDefined(fields.totalCount),
      endCursor: isDefined(fields.pageInfo?.endCursor),
      startCursor: isDefined(fields.pageInfo?.startCursor),
      edgeCursors: isDefined(fields?.edges?.cursor)
    };
  }

  baseFields(node?: Node): string[] {
    if (!node) {
      return [];
    }

    const scalars = Object.keys(node).filter(item => {
      return Object.keys(node[item]).length === 0;
    });

    return scalars;
  }
}

// { totalCount: {},
// edges: { node: { name: {}, kitchenSink: [Object] }, cursor: {} },
// pageInfo:
//  { hasNextPage: {},
//    hasPreviousPage: {},
//    startCursor: {},
//    endCursor: {} } }

function isDefined(obj: unknown): boolean {
  return typeof obj !== 'undefined';
}
