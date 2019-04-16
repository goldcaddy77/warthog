import * as Debug from 'debug';

import { getServer } from '../src/server';

const logger = Debug('warthog:generate');

async function generate() {
  return getServer({}).generateFiles();
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
