import * as Debug from 'debug';

// TODO: better logger
export const customLogger = {
  error: Debug('custom:error'),
  info: Debug('custom:info'),
  log: Debug('custom:log'),
  warn: Debug('custom:warn')
};

type logFunc = (...args: any[]) => void;
