import * as Debug from 'debug';
import { stringify } from 'flatted';
import { performance } from 'perf_hooks';
import * as util from 'util';

type MethodDecorator = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any;

export function debug(key: string): MethodDecorator {
  const logger = Debug(key);

  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    if (util.types.isAsyncFunction(originalMethod)) {
      descriptor.value = async function(...args: unknown[]): Promise<any> {
        logger(`Entering ${propertyKey} with args: ${stringify(args)}`);
        const start = performance.now();
        const result = await originalMethod.apply(this, args);
        const end = performance.now();
        logger(`Exiting  ${propertyKey} after ${(end - start).toFixed(2)} milliseconds.`);
        return result;
      };
    } else {
      descriptor.value = function(...args: unknown[]) {
        logger(`Entering ${propertyKey} with args: ${stringify(args)}`);
        const start = performance.now();
        const result = originalMethod.apply(this, args);
        const end = performance.now();
        logger(`Exiting  ${propertyKey} after ${(end - start).toFixed(2)} milliseconds.`);
        return result;
      };
    }
    return descriptor;
  };
}
