import * as Debug from 'debug';

import { loadConfig } from '../src/config';
import { getServer } from '../src/server';

const logger = Debug('warthog:generate');

async function generate() {
  loadConfig();

  return getServer({ mockDBConnection: true }).generateFiles();
}

generate()
  .then(result => {
    logger(result);
    return process.exit(0);
  })
  .catch(err => {
    console.log(err);
    return process.exit(1);
  });
