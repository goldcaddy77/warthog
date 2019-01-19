import * as Debug from 'debug';

// TODO: better logger
export const logger = {
  error: Debug('warthog:error'),
  info: Debug('warthog:error'),
  log: Debug('warthog:error'),
  warn: Debug('warthog:error')
};

type logFunc = (...args: any[]) => void;

export interface Logger {
  error: logFunc;
  info: logFunc;
  log: logFunc;
  warn: logFunc;
}
