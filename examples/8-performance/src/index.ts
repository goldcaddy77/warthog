import 'reflect-metadata';

import { loadConfig } from '../src/config';
import { getServer } from './server';

async function bootstrap() {
  await loadConfig();

  const server = getServer();
  await server.start();
}

bootstrap().catch((error: Error) => {
  console.error(error);
  if (error.stack) {
    console.error(error.stack!.split('\n'));
  }
  process.exit(1);
});
