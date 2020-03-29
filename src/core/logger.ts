import * as Debug from 'debug';
import * as util from 'util';

import { Service } from 'typedi';

@Service('warthog.logger')
export class Logger {
  debug = Debug('warthog:debug');
  error = console.error; // eslint-disable-line
  info = console.info; // eslint-disable-line
  log = console.log; // eslint-disable-line
  warn = console.warn; // eslint-disable-line
  logObject = (...args: any[]) =>
    console.log(util.inspect(args, { showHidden: false, depth: null })); // eslint-disable-line
}
