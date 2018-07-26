import { ArgumentValidationError, MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import { Service } from 'typedi';

import { Context } from '../core';

@Service()
export class ErrorLoggerMiddleware implements MiddlewareInterface<Context> {
  // constructor(private readonly logger: Logger) {}
  constructor() {
    //
  }

  async use({ context, info }: ResolverData<Context>, next: NextFn) {
    try {
      return await next();
    } catch (err) {
      // this.logger.log({
      //   message: err.message,
      //   operation: info.operation.operation,
      //   fieldName: info.fieldName,
      //   userName: context.username
      // });
      if (!(err instanceof ArgumentValidationError)) {
        // hide errors from db like printing sql query
        throw new Error('Unknown error occurred. Try again later!');
      }
      throw err;
    }
  }
}
