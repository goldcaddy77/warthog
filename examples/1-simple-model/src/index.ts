import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { Container } from 'typedi';

dotenv.config();

import { App } from '../../../src/';

async function bootstrap() {
  const app = new App({
    container: Container,
    warthogImportPath: '../../../src' // Path written in generated classes
  });

  await app.start();
}

bootstrap().catch((error: Error) => {
  console.error(error);
  if (error.stack) {
    console.error(error.stack!.split('\n'));
  }
  process.exit(1);
});
