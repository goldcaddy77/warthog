import 'reflect-metadata';
import { logger } from '@warthog/core';

import { getServer } from './server';

async function bootstrap() {
  const server = getServer({ subscriptions: true });
  await server.start();
}

bootstrap().catch((error: Error) => {
  logger.error(error);
  if (error.stack) {
    logger.error(error.stack.split('\n'));
  }
  process.exit(1);
});
