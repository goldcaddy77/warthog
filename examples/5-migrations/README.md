# Example 1 - User Model

## Setup

Run `yarn bootstrap && yarn start`

## Bootstrapping the App

Running `yarn bootstrap` will do the following:

- Install packages
- Create the example DB
- Generate code in `generated` folder

## Generate DB schema migration

To automatically generate a schema migration file, run `yarn db:migration:generate`.  The migration will be put in the `db/migrations` folder

## Run the DB migration

To run the DB migration, run `yarn db:migration:run`
