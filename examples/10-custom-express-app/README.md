# Example 10 - Custom Express Application

## Setup

Run `yarn bootstrap && yarn start`

## Bootstrapping the App

Running `yarn bootstrap` will do the following:

- Install packages
- Create the example DB

## Running the App

To run the project, run `yarn start`.  This will:

- Run the API server
- Open GraphQL Playground

## Example Queries/Mutations

You can find some examples in [examples.gql](./examples.gql)

## Testing REST Endpoints on our Custom Express Application

You can send a GET request to the `/user/id/:userId` endpoint (e.g. `http://localhost:4100/user/id/abc123`) to see that our endpoint exists on the express app that warthog is using and has access to the same database as the GraphQL resolvers.
