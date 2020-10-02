# Need to run codegen in DEV mode no matter what because we need decorators to fire
WARTHOG_ENV=local yarn run config
yarn run codegen

WARTHOG_ENV=production yarn run config
yarn compile