import * as Debug from 'debug';

// TODO: better logger
export const logger = {
  debug: Debug('warthog:debug'),
  error: console.error, // eslint-disable-line
  info: console.info, // eslint-disable-line
  log: console.log, // eslint-disable-line
  warn: console.warn // eslint-disable-line
};

type logFunc = (...args: any[]) => void;

export interface Logger {
  debug?: logFunc;
  error: logFunc;
  info: logFunc;
  log: logFunc;
  warn: logFunc;
}
