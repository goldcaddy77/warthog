import { createDB, dropDB } from '@warthog/core';

process.env.NODE_ENV = 'test';
process.env.PGUSER = 'postgres';

async function run() {
  await createDB();
  await dropDB();

  // # Codegen for test files
  // NODE_ENV=test ./src/test/codegen-test-files.sh

  // # Forward command line args to the jest command
  // NODE_ENV=test jest --verbose --runInBand $@
}

run()
  .then(console.log) // eslint-disable-line
  .catch(console.error); // eslint-disable-line
