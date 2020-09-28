/* eslint-disable no-console */
import * as util from 'util';

import { getBindingError } from 'warthog';

export class Logger {
  static info(...args: any[]) {
    console.log(util.inspect(args, { showHidden: false, depth: null }));
  }

  static error(...args: any[]) {
    console.error(util.inspect(args, { showHidden: false, depth: null }));
  }

  // This takes a raw GraphQL error and pulls out the relevant info
  static logGraphQLError(error) {
    console.error(util.inspect(getBindingError(error), { showHidden: false, depth: null }));
  }
}
/* eslint-enable no-console */
