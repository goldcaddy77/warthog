#! /bin/bash
set -e

load_dotenv()
{
  for line in $(cat $1); do
    export $line
  done
}

# load .env into this shell
load_dotenv .env

if [ -z "$1" ]; then # Deploy both app specific infastrcture and fargate api
  echo "Must specify migration name"
  exit 1
fi

yarn ts-node ./node_modules/.bin/typeorm migration:generate -n $1
