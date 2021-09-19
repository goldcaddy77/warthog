set -e 

# Make sure dates are imported in UTC so that we don't have off-by-one issues
export TZ=utc

# Codegen for test files
# V3: do the codegen as part of the test suite now
NODE_ENV=test ./src/test/codegen-test-files.sh

if [ -z "$SKIP_DB_CREATION" ]
then
  NODE_ENV=test PGUSER=postgres WARTHOG_DB_PASSWORD=postgres ./bin/warthog db:drop
  NODE_ENV=test PGUSER=postgres WARTHOG_DB_PASSWORD=postgres ./bin/warthog db:create
fi

# Forward command line args to the jest command
NODE_ENV=test jest --verbose --runInBand $@
