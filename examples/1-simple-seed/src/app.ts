import 'reflect-metadata';

import { Container } from 'typedi';
import { App, AppOptions } from '../../../src/';

// import { User } from './modules/user/user.entity';

export function getApp(appOptions: Partial<AppOptions> = {}, dbOptions: any = {}) {
  return new App(
    // Path written in generated classes
    {
      container: Container,
      warthogImportPath: '../../../src',
      ...appOptions
    },
    {
      cache: true,
      synchronize: true,
      // dropSchema: true,
      ...dbOptions
    }
  );
}
