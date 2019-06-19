import 'reflect-metadata';

import { logger } from '../../../src';

import { loadConfig } from '../src/config';
import { getServer } from './server';

async function bootstrap() {
  await loadConfig();

  const server = getServer();
  await server.start();
}

bootstrap().catch((error: Error) => {
  logger.error(error);
  if (error.stack) {
    logger.error(error.stack.split('\n'));
  }
  process.exit(1);
});
