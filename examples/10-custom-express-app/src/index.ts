import 'reflect-metadata';

import { logger } from '../../../src';

import { getServer } from './server';
import { initializeSwaggerMiddleware } from './swagger/swagger.middleware';

async function bootstrap() {
  const server = getServer();
  await server.start();
  initializeSwaggerMiddleware(server.expressApp);
}

bootstrap().catch((error: Error) => {
  logger.error(error);
  if (error.stack) {
    logger.error(error.stack.split('\n'));
  }
  process.exit(1);
});
