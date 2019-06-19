import { loadConfig } from '../src/config';
import { Logger } from '../src/logger';
import { getServer } from '../src/server';

async function generate() {
  loadConfig();
  return getServer({ mockDBConnection: true }).generateFiles();
}

generate()
  .then(result => {
    Logger.info(result);
    return process.exit(0);
  })
  .catch(err => {
    Logger.error(err);
    return process.exit(1);
  });
