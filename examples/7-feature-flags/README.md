# Example 7 - Feature Flags

## TODO

- Need to add `tags` as an array type that is searchable
- FeatureFlagSegment
- UserSegment
- featureFlagsForUser (CUSTOM QUERY)
- Question: how long should `key`s be?

[LaunchDarkly](https://apidocs.launchdarkly.com/reference)

## Setup

Run `yarn bootstrap && yarn start`

## Bootstrapping the App

Running `DEBUG=* yarn bootstrap` will do the following:

- Install packages
- Create the example DB
- Seed the database with test data

## Running the App

To run the project, run `yarn start`.  This will:

- Run the API server
- Open GraphQL Playground
