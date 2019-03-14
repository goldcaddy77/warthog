const appRoot = require('app-root-path'); // tslint:disable-line:no-var-requires
import * as path from 'path';
import { Container } from 'typedi';

export const generatedFolderPath = (): string => {
  try {
    return Container.get('warthog.generated-folder');
  } catch (error) {
    return path.join(appRoot.path, 'generated');
  }
};
