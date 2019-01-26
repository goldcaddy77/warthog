import 'reflect-metadata';

import * as dotenv from 'dotenv';

import { getServer } from './server';

dotenv.config();

async function bootstrap() {
  const server = getServer();
  await server.start();
}

bootstrap().catch((error: Error) => {
  console.error(error);
  if (error.stack) {
    console.error(error.stack.split('\n'));
  }
  process.exit(1);
});
