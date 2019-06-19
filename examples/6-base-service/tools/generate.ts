import { logger } from '../../../src';

import { loadConfig } from '../src/config';
import { getServer } from '../src/server';

async function generate() {
  loadConfig();

  return getServer({ mockDBConnection: true }).generateFiles();
}

generate()
  .then(result => {
    logger.info(result);
    return process.exit(0);
  })
  .catch(err => {
    logger.error(err);
    return process.exit(1);
  });
