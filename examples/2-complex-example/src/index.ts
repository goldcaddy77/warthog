import 'reflect-metadata';

import * as dotenv from 'dotenv';

import { getApp } from './app';

dotenv.config();

async function bootstrap() {
  const app = getApp();
  await app.start();
}

bootstrap().catch((error: Error) => {
  console.error(error);
  if (error.stack) {
    console.error(error.stack.split('\n'));
  }
  process.exit(1);
});
