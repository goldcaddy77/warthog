import 'reflect-metadata';

import { app } from './app';

async function bootstrap() {
  await app.generateTypes();
  await app.start();
}

bootstrap().catch((error: Error) => {
  console.error(error);
  if (error.stack) {
    console.error(error.stack!.split('\n'));
  }
  process.exit(1);
});
