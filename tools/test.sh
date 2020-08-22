set -e 

if [ -z "$SKIP_DB_CREATION" ]
then
  NODE_ENV=test PGUSER=postgres ./bin/warthog db:drop
  NODE_ENV=test PGUSER=postgres ./bin/warthog db:create
fi

# Codegen for test files
NODE_ENV=test ./src/test/codegen-test-files.sh

# Forward command line args to the jest command
NODE_ENV=test jest --verbose --runInBand $@
