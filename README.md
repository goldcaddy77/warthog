<p align="center">
  <a href="http://warthog.dev/"><img src="./img/warthog-logo.png" width="400" alt="Warthog Logo"></a>
</p>

 <p align="center">
   Node.js <a href="https://graphql.org" target="_blank">GraphQL</a> Framework for building APIs with strong conventions through auto-generated code.  With Warthog, set up your data models and resolvers, and it does the rest.
</p>

<p align="center">
  <a href="https://blacklivesmatter.com/"><img src="https://img.shields.io/badge/branch-main-fce21b?labelColor=black" alt="Black Lives Matter"/></a>
  <a href="https://www.npmjs.org/package/warthog"><img src="https://img.shields.io/npm/v/warthog.svg" alt="npm version"></a>
  <a href="https://circleci.com/gh/goldcaddy77/warthog/tree/main"><img src="https://circleci.com/gh/goldcaddy77/warthog/tree/main.svg?style=shield" alt="CircleCI"></a>
  <a href="https://codecov.io/gh/goldcaddy77/warthog"><img src="https://codecov.io/gh/goldcaddy77/warthog/branch/master/graph/badge.svg" alt="styled with prettier"></a>
  <a href="#badge"><img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg" alt="styled with prettier"></a>
  <a href="https://github.com/semantic-release/semantic-release"><img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg" alt="semantic-release"></a>
  <a href="https://gitter.im/warthog-graphql/community?utm_source=badge&amp;utm_medium=badge&amp;utm_campaign=pr-badge&amp;utm_content=badge"><img src="https://badges.gitter.im/warthog-graphql/community.svg" alt="Join the chat at https://gitter.im/warthog-graphql/community"></a>
</p>

## Summary

Warthog is a [Node.js](http://nodejs.org) GraphQL API framework for quickly building consistent GraphQL APIs that have sorting, filtering and pagination out of the box. It is written in [TypeScript](http://www.typescriptlang.org) and makes heavy use of decorators for concise, declarative code.

## Note: Upgrading from 1.0 to 2.0

Warthog is now on version 2.0! There were a few breaking changes that you should consider while upgrading. Also, we tried to keep all new features development on v1, but did end up adding JSON filtering directly to 2.0 as it was much easier given some foundation refactors.

<details>
<summary>Expand for Breaking change details</summary>
<p>

### More specific scalars

A few fields have been updated to use more specific GraphQL scalars:

- ID fields: previously these were represented by type `String`. Dates now use type `ID`
- Date fields: previously these were represented by type `String`. Dates now use type `DateTime`

Since your GraphQL schema has changed and so have the associated TypeScript types in `classes.ts`, there might be changes in your server code and even perhaps some associated client code if you use these generated classes in your client code.

### `mockDBConnection` has been removed

The old codegen pipeline used TypeORM's metadata in order to generate the GraphQL schema since Warthog didn't also capture this metadata. Warthog now captures the necessary metadata, so we no longer need to lean on TypeORM and therefore we don't need the `mockDBConnection` we previously used during codegen. Searching your codebase for `mockDBConnection` and `WARTHOG_MOCK_DATABASE`/`MOCK_DATABASE` should do it. If you've been using the Warthog CLI for codegen, you shouldn't have anything to do here.

### Project Dependencies Updated

Staying on the latest versions of libraries is good for security, performance and new features. We've bumped to the latest stable versions of each of Warthog's dependencies. This might require some changes to your package.json.

### Troubleshooting

#### Cannot get connection "default" from the connection manager

If you get an error like:

```txt
Cannot get connection "default" from the connection manager. Make sure you have created such connection. Also make sure you have called useContainer(Container) in your application before you established a connection and importing any entity.
```

It could be caused by 2 things:

##### Remove explicit `Container` injection

In V1 of Warthog, the README suggested that you should explicitly create your DI containers and pass them into your `App` instance like so:

```typescript
import { Container } from 'typedi'; // REMOVE this
import { useContainer } from 'typeorm'; // REMOVE this

import { App } from 'warthog';

async function run() {
  useContainer(Container); // REMOVE this

  const app = new App({ container: Container }); // REMOVE the container option here
  await app.start();
}
```

In V2, it is recommended that you no longer do this unless you explicitly need access to the Container.

##### Remove references to Warthog's dependencies

It can sometimes cause problems to explicitly require Warthog's depdendencies (ie `type-graphql`, `typedi`, `typeorm` and `typeorm-typedi-extensions`). In future versions, remove these explicit dependencies from `package.json`:

```txt
- "type-graphql": "...",
- "typedi": "...",
- "typeorm": "...",
- "typeorm-typedi-extensions": "...",
```

</p>
</details>

## Philosophy

This library is intentionally opinionated and generates as much code as possible. When teams build products quickly, even if they have strong conventions and good linters, the GraphQL can quickly become inconsistent, making it difficult for clients to consume the APIs in a reusable way.

To do this, Warthog automatically generates the following:

- Database schema - generated by [TypeORM](https://github.com/typeorm/typeorm)
- Your entire GraphQL Schema including:
  - types to match your entities - generated by [TypeGraphQL](https://github.com/19majkel94/type-graphql)
  - GraphQL inputs for consistent creates, updates, filtering, and pagination
    inspired by [Prisma](https://github.com/prisma/prisma)'s conventions
- A [graphql-binding](https://github.com/graphql-binding/graphql-binding) for
  type-safe programmatic access to your APIs.
- TypeScript classes for the generated GraphQL schema for type-safety while developing.

Further, it covers the following concerns by hooking into best-in-class open source libraries:

- Validation: Automatic validation before data is saved using any of the decorators available in the [class-validator](https://github.com/typestack/class-validator#validation-decorators) library.

## Prerequisites

Warthog currently only supports PostgreSQL as a DB engine, so you must have Postgres installed before getting Warthog set up. (Note: Postgres 12 is not currently supported)

<details>
<summary>Expand for Postgres installation options</summary>
<p>

### Homebrew (OSX)

If you're on OSX and have [homebrew](http://brew.sh/) and [homebrew-cask](https://github.com/caskroom/homebrew-cask) installed, you can simply run:

```bash
brew cask install postgres
```

Or you can install Homebrew's official version:

```bash
brew install postgresql
`brew --prefix`/opt/postgres/bin/createuser -s postgres
```

### Postgres.app (OSX)

Otherwise, you can install [Postgres.app](https://postgresapp.com/) manually.

### Docker

See the [warthog-starter](https://github.com/goldcaddy77/warthog-starter/pull/6/files) project for how to use Docker to run Postgres.

</p>
</details>

## Getting Started

Warthog comes with a CLI that makes it easy to get started.

### Create new project with the CLI

To install in an existing project, you'll need to create several files in place and then you'll need to call a few Warthog CLI commands that:

- Generate a new resource
- Create a database
- Create a DB migration and run it
- Run the server

The following code will get you bootstrapped. You should read through this before running:

```bash
# Add warthog so that we can use the CLI
yarn add warthog

# Bootstrap a new application using Warthog CLI
yarn warthog new

# Install dependencies from generated package.json
yarn

# Generate a resource (model, resolver and service)
yarn warthog generate user name! nickname age:int! verified:bool!

# Generate typescript classes and GraphQL schema
yarn warthog codegen

# Create your DB
yarn warthog db:create

# Generate the DB migration for your newly generated model
yarn warthog db:migrate:generate --name=create-user-table

# Run the DB migration
yarn warthog db:migrate

# Start the server
yarn start:dev
```

Here's what this looks like in action:

![warthog-quickstart](https://user-images.githubusercontent.com/573625/69854217-8967f380-1256-11ea-8492-dee07334501d.gif)

This will open up GraphQL Playground, where you can execute queries and mutations against your API.

First, add a user by entering the following in the window:

```graphql
mutation {
  createUser(data: { name: "Test User", age: 25, verified: false }) {
    id
    name
    createdAt
  }
}
```

Then, query for this user:

```graphql
query {
  users {
    id
    name
    createdAt
  }
}
```

See [introducing-graphql-playground](https://www.prisma.io/blog/introducing-graphql-playground-f1e0a018f05d) for more info about GraphQL Playground.

<details>
<summary>Expand for other options for how to play with Warthog</summary>
<p>

### Cloning the `warthog-starter` project

Another way to start playing with Warthog is to clone the [warthog-starter](https://github.com/goldcaddy77/warthog-starter) repo. To get the starter project up and running, do the following:

```bash
git clone git@github.com:goldcaddy77/warthog-starter.git
cd warthog-starter
yarn bootstrap
WARTHOG_AUTO_OPEN_PLAYGROUND=true yarn start:dev
```

### Running the examples in the Warthog repo

You can also clone the Warthog repo and run the examples in the [examples](./examples/README.md) folder.

```bash
git clone git@github.com:goldcaddy77/warthog.git
cd warthog/examples/01-simple-model
yarn bootstrap
yarn db:seed:dev
yarn start
```

This has a simple example in place to get you started. There are also a bunch of examples in the folder for more advanced use cases.

Note that the examples in the [examples](./examples/README.md) folder use relative import paths to call into Warthog. In your projects, you won't need to set this config value as it's only set to deal with the fact that it's using the Warthog core files without consuming the package from NPM. In your projects, you can omit this as I do in [warthog-starter](https://github.com/goldcaddy77/warthog-starter).

</p>
</details>

## Contributing

PRs accepted, fire away! Or add issues if you have use cases Warthog doesn't cover.

Before contributing, make sure you have Postgres installed and running with a user named `postgres` with an empty password. If you don't have this local Postgres user, you'll need to update the `.env` files in the `examples` folders to point to a user that can run DB migrations.

Once you have this user set up, you can build a specific example by navigating to that folder and running `yarn bootstrap`.

If you want to build all examples, you can run `yarn bootstrap` from the Warthog root folder.

It's helpful to add a new feature to the Warthog and make use of it in one of the examples folders until you've determined how it's going to work. Once you have it working, you can add tests.

## Intentionally Opinionated

Warthog is intentionally opinionated to accelerate development and make use of technology-specific features:

- Postgres - currently the only database supported. This could be changed, but choosing Postgres allows adding a docker container and other goodies easily.
- Jest - other harnesses will work, but if you use Jest, we will not open the GraphQL playground when the server starts, for example.
- Soft deletes - no records are ever deleted, only "soft deleted". The base service used in resolvers filters out the deleted records by default.

## Thanks

Special thanks to:

- [TypeORM](https://github.com/typeorm/typeorm) - DB generation
- [TypeGraphQL](https://github.com/19majkel94/type-graphql) - GraphQL generation
- [Prisma](https://github.com/prisma/prisma) - [OpenCrud](https://github.com/opencrud/opencrud) conventions
- [richardbmx](https://github.com/richardbmx) - Logo design

Warthog is essentially a really opinionated composition of TypeORM and TypeGraphQL that uses similar GraphQL conventions to the Prisma project.

## License

MIT © Dan Caddigan

[1]: https://nodejs.org/api/http.html#http_server_headerstimeout
[2]: https://nodejs.org/api/http.html#http_server_keepalivetimeout
