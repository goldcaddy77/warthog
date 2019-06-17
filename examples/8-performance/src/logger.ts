import * as util from 'util';

import { getBindingError } from '../../../src';

export class logger {
  static log(...args: any[]) {
    console.log(util.inspect(args, { showHidden: false, depth: null }));
  }

  // This takes a raw GraphQL error and pulls out the relevant info
  static logGraphQLError(error) {
    console.error(util.inspect(getBindingError(error), { showHidden: false, depth: null }));
  }
}
