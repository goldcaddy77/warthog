import 'reflect-metadata';

import * as dotenv from 'dotenv';

import { getServer } from './app';

dotenv.config();

async function bootstrap() {
  const app = getServer();
  await app.start();
}

bootstrap().catch((error: Error) => {
  console.error(error);
  if (error.stack) {
    console.error(error.stack.split('\n'));
  }
  process.exit(1);
});
