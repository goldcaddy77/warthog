import * as Debug from 'debug';

// TODO: better logger
export const logger = {
  error: console.error, // eslint-disable-line
  info: Debug('warthog:info'),
  log: Debug('warthog:log'),
  warn: Debug('warthog:warn')
};

type logFunc = (...args: any[]) => void;

export interface Logger {
  error: logFunc;
  info: logFunc;
  log: logFunc;
  warn: logFunc;
}
