import 'reflect-metadata';
import * as path from 'path';

import { App, logger } from '../../src/core';

async function bootstrap() {
  const app = new App(
    {
      generatedFolder: path.join(__dirname, '..', '/generated'),
      port: 4000
    },
    {
      cache: true,
      // database: 'type-graphql', // Set TYPEORM_DATABASE
      // username: 'root', // Set TYPEORM_USERNAME
      // password: 'qwerty123', // Set TYPEORM_PASSWORD
      port: 5432,
      host: 'localhost',
      // entities: [Recipe, Rate, User],
      entities: ['modules/**/*.entity.ts'],
      synchronize: true,
      logger: 'advanced-console',
      logging: 'all',
      dropSchema: true,
      type: 'postgres'
    }
  );
  await app.start();
}

bootstrap().catch((error: Error) => {
  logger.error(JSON.stringify(error, undefined, 2));
  if (error.stack) {
    logger.error(JSON.stringify(error.stack!.split('\n'), undefined, 2));
  }
  process.exit(1);
});
