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

Warthog currently only supports PostgreSQL as a DB engine, so you must have Postgres installed before getting Warthog set up.

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

### Warthog Constructs Explained

#### Models

A model represents both a GraphQL type and a DB table. Warthog exposes a [BaseModel](https://github.com/goldcaddy77/warthog/blob/master/src/core/BaseModel.ts) class that provides the following columns for free: `id`, `createdAt`, `createdById`, `updatedAt`, `updatedById`, `deletedAt`, `deletedById`, `version`. If you use BaseModel in conjunction with BaseService (see below), all of these columns will be updated as you'd expect. The Warthog server will find all models that match the following glob - `'/**/*.model.ts'`. Ex: `user.model.ts`

Custom [TypeORM](https://github.com/typeorm/typeorm/blob/master/docs/decorator-reference.md#entity) and [TypeGraphQL](https://typegraphql.ml/docs/types-and-fields.html) options may be passed into the `Model` decorator using the following signature.

```javascript
@Model({ api: { description: 'Custom description' }, db: { name: 'customtablename' } })
```

#### Resolvers

A Warthog resolver exposes queries (reading data) and mutations (writing data). They interact with the DB through `services` (described below) and typically make use of a bunch of auto-generated TypeScript types in the `generated` folder for things like sorting and filtering. Warthog will find all resolvers that match the following glob - `'/**/*.resolver.ts'`. Ex: `user.resolver.ts`

#### Services

Services are the glue between resolvers and models. Warthog exposes a class called [BaseService](https://github.com/goldcaddy77/warthog/blob/master/src/core/BaseService.ts) that exposes the following methods: `find`, `findOne`, `create`, `update`, `delete`. For the `find` operator, it also maps the auto-generated `WhereInput` attributes to the appropriate TypeORM Query Builders. Warthog's convention is to name services `<model-name>.service.ts`. Ex: `user.service.ts`

#### Generated Folder

When you start your server, there will be a new `generated` folder that Warthog creates automatically. The folder contains:

- classes.ts: Warthog auto-generates this file from the metadata it collects (from decorators like `Model`, `Query`, `Resolver`, `StringField`, etc...). Resolvers will import items from here instead of having to manually create them.
- schema.graphql: This is auto-generated from our resolvers, models and `classes.ts` above. Check out [this example's schema.graphql](https://github.com/goldcaddy77/warthog/blob/master/examples/01-simple-model/generated/schema.graphql) to show the additional GraphQL schema Warthog autogenerates.
- ormconfig.ts: a TypeORM [ormconfig](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md) file.
- binding.ts - a [graphql-binding](https://www.prisma.io/docs/1.10/graphql-ecosystem/graphql-binding/graphql-binding-quaidah9ph) for type-safe programmatic access to your API (making real API calls)

## Server API (appOptions)

Most of the config in Warthog is done via environment variables (see `Config - Environment Variables` below). However, more complex/dynamic objects should be passed via the server config.

| attribute                 | description                                                                                               | default                                       |
| ------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| container                 | TypeDI container. Warthog uses dependency injection under the hood.                                       | empty container                               |
| authChecker               | An instance of an [AuthChecker](https://typegraphql.ml/docs/authorization.html) to secure your resolvers. |                                               |
| context                   | Context getter of form `(request: Request) => Promise<object>`                                            | empty                                         |
| logger                    | Logger                                                                                                    | [debug](https://github.com/visionmedia/debug) |
| middlewares               | [TypeGraphQL](https://typegraphql.ml/docs/middlewares.html) middlewares to add to your server             | none                                          |
| onBeforeGraphQLMiddleware | Callback executed just before the Graphql server is started. The Express app is passed.                   | none                                          |
| onAfterGraphQLMiddleware  | Callback executed just after the Graphql server is started. The Express app is passed.                    | none                                          |

## Config - Environment Variables

Almost all config in Warthog is driven by environment variables. The following items are available:

| variable                      | value                                                    | default                   |
| ----------------------------- | -------------------------------------------------------- | ------------------------- |
| WARTHOG_APP_HOST              | App server host                                          | _none_                    |
| WARTHOG_APP_PORT              | App server port                                          | 4000                      |
| WARTHOG_APP_PROTOCOL          | App server protocol                                      | DEV: http, PROD: https    |
| WARTHOG_AUTO_GENERATE_FILES   | Auto-generate files                                      | DEV: true, PROD: false    |
| WARTHOG_AUTO_OPEN_PLAYGROUND  | Open playground on server start                          | DEV: true, PROD: false    |
| WARTHOG_CLI_GENERATE_PATH     | Where should CLI generate files                          | ./src                     |
| WARTHOG_DB_DATABASE           | DB name                                                  | _none_                    |
| WARTHOG_DB_ENTITIES           | Where should warthog look for models                     | src\/\*\*\/\*.model.ts    |
| WARTHOG_DB_MIGRATIONS         | What DB migrations should TypeORM run                    | db/migrations/\*\*\/\*.ts |
| WARTHOG_DB_MIGRATIONS_DIR     | Where should generated migrations be placed              | db/migrations             |
| WARTHOG_DB_PORT               | DB port                                                  | 5432                      |
| WARTHOG_DB_USERNAME           | DB username                                              | _none_                    |
| WARTHOG_DB_LOGGER             | TypeORM logger                                           | advanced-console          |
| WARTHOG_DB_PASSWORD           | DB password                                              | _none_                    |
| WARTHOG_DB_SYNCHRONIZE        | DB automatically migrated                                | false                     |
| WARTHOG_FILTER_BY_DEFAULT     | Should all filters and sorts be generated by default?    | true                      |
| WARTHOG_GENERATED_FOLDER      | Where should generated code be placed                    | ./generated               |
| WARTHOG_HEADERS_TIMEOUT_MS    | See [Node server.headersTimeout][1]                      | 60000                     |
| WARTHOG_INTROSPECTION         | Allow server to be introspected                          | true                      |
| WARTHOG_KEEP_ALIVE_TIMEOUT_MS | See [Node server.keepAliveTimeout][2]                    | 30000                     |
| WARTHOG_RESOLVERS_PATH        | Where should Warthog look for resolvers                  | src/\*\*\/\*.resolver.ts  |
| WARTHOG_SUBSCRIPTIONS         | Should we enable subscriptions and open a websocket port | false                     |
| WARTHOG_VALIDATE_RESOLVERS    | TypeGraphQL validation enabled?                          | false                     |

## Field/Column Decorators

All of the auto-generation magic comes from the decorators added to the attributes on your models. Warthog decorators are convenient wrappers around TypeORM decorators (to create DB schema) and TypeGraphQL (to create GraphQL schema). You can find a list of decorators available in the [src/decorators](./src/decorators) folder. Most of these are also used in the [examples](./examples) folder in this project.

## Transactions

There are a few ways to handle transactions in the framework, depending if you want to use `BaseService` or use your repositories directly.

### Using BaseService

To wrap BaseService operations in a transaction, you do 3 things:

1. Create a function decorated with the `@Transaction` method decorator
2. Inject `@TransactionManager` as a function parameter
3. Pass the `@TransactionManager` into calls to `BaseService`

#### @Transaction method decorator

The `@Transaction` decorator opens up a new transaction that is then available via the `@TransactionManager`. It will automatically close the transaction when the function returns, so it is important to `await` your service calls and not return a promise in this function.

```typescript
  @Transaction()
  async createTwoItems() {
    // ...
  }
```

#### @TransactionManager decorator

The `@TransactionManager` is essentially the same as a TypeORM EntityManger, except it wraps everything inside of it's transaction.

```typescript
  @Transaction()
  async createTwoItems(
        @TransactionManager() manager?: EntityManager
  ) {
    // ...
  }
```

#### Pass manager to BaseService

You can pass the entity manager into any of the `BaseService` methods to ensure they're part of the transaction.

```typescript
  @Transaction()
  async createTwoItems(
        @TransactionManager() manager?: EntityManager
  ) {
    this.create(data, userId, { manager })
  }
```

#### Example

```typescript
@Service('UserService')
export class UserService extends BaseService<User> {
  constructor(@InjectRepository(User) protected readonly repository: Repository<User>) {
    super(User, repository);
  }

  // GOOD: successful transaction
  @Transaction()
  async successfulTransaction(
    data: DeepPartial<User>,
    userId: string,
    @TransactionManager() manager?: EntityManager
  ): Promise<User[]> {
    return Promise.all([
      this.create(data, userId, { manager }),
      this.create(data, userId, { manager })
    ]);
  }

  // GOOD: successful rollback when something errors
  @Transaction()
  async failedTransaction(
    data: DeepPartial<User>,
    userId: string,
    @TransactionManager() manager?: EntityManager
  ): Promise<User[]> {
    const invalidUserData = {};

    const users = await Promise.all([
      this.create(data, userId, { manager }),
      this.create(invalidUserData, userId, { manager }) // This one fails
    ]);

    return users;
  }

  // BAD: you can't return a promise here.  The function will return and the first
  // user will be saved even though the 2nd one fails
  @Transaction()
  async failedTransaction(
    data: DeepPartial<User>,
    userId: string,
    @TransactionManager() manager?: EntityManager
  ): Promise<User[]> {
    return await Promise.all([
      this.create(data, userId, { manager }),
      this.create(invalidUserData, userId, { manager })
    ]);
  }
}
```

See the [TypeORM Transaction Docs](https://github.com/typeorm/typeorm/blob/master/docs/transactions.md#transaction-decorators) for more info.

## Complex use cases

Warthog makes building simple CRUD endpoints incredibly easy. In addition, since it is built on top of TypeORM and TypeGraphQL it is flexible enough to handle complex use cases as well. If you need a field to be exposed to either the DB or API, but not both, do the following:

### DB-only

If you need to add a column to the DB that does not need to be exposed via the API, you should pass the `dbOnly` option to your decorator:

```typescript
  @StringField({ dbOnly: true })
  dbOnlyField!: string;
```

Note that you could also just use the [TypeORM Column Decorator](https://github.com/typeorm/typeorm/blob/master/docs/decorator-reference.md) as well. However, if Warthog adds additional capabilities in this space, we would not have this column metadata, so it is recommended you use the `dbOnly` option.

### API-only

If you need to add a field that is exposed via the API that is not database-backed, use the `apiOnly` option:

```typescript
  @StringField({ apiOnly: true })
  apiOnlyField!: string;
```

### Custom Query

See the [feature-flag example](./examples/07-feature-flags/) for an example of where we'd want to build something beyond the standard CRUD actions. In this example we want to add a custom query that makes a complex DB call.

- First add the query to the resolver - [link to code](https://github.com/goldcaddy77/warthog/blob/master/examples/07-feature-flags/src/feature-flag/feature-flag.resolver.ts#L75-L79)
- Then add the custom query input in the resolver - [link to code](https://github.com/goldcaddy77/warthog/blob/master/examples/07-feature-flags/src/feature-flag/feature-flag.resolver.ts#L31-L41)
- Then add the custom service method that fetches the data [link to code](https://github.com/goldcaddy77/warthog/blob/master/examples/07-feature-flags/src/feature-flag/feature-flag.service.ts#L28-L48)

Warthog will generate the correct GraphQL query and InputType automatically.

## CLI

Warthog ships with the following commands that can be accessed by running `yarn warthog <command>`.

See the [warthog-starter](https://github.com/goldcaddy77/warthog-starter/blob/master/package.json) project's package.json for example usage.

| Command           | Args      | Description                                                                             |
| ----------------- | --------- | --------------------------------------------------------------------------------------- |
| codegen           | none      | autogenerates code from decorated models and resolvers and places in `generated` folder |
| db:create         | none      | creates DB based on DB specified in config file                                         |
| db:drop           | none      | drops DB based on DB specified in config file                                           |
| generate          | See below | generates a model, service and resolver                                                 |
| db:migrate        | none      | migrates DB (proxies through TypeORM CLI)                                               |
| db:migrate:create | none      | auto-generates DB migration based on new code additions (proxies through TypeORM CLI)   |

### `generate` Command in depth

The `generate` command will create a new resolver, service and model for a given resource. Let's start with a complex example and we'll break it down:

```bash
yarn warthog generate user name! nickname numLogins:int! verified:bool! registeredAt:date balance:float! --folder my_generated_folder
```

- `user` - this is the name of the new resource (required)
- ...args - each of the remaining args until `--folder` is a field on the resource
- `name!` - the name field is of type string by default since no data type is specified. The `!` states that it's required
- `numLogins:int!` - numLogins states that it is of type int - also required
- `registeredAt:date` - registeredAt is of type date (which correlates to an ISO8601 datetime). The absence of the `!` means it is optional.
- ...the rest of the args are self-explanatory. Possible types are `bool`, `date`, `int`, `float` and `string`. If you need to use other types, just add them as strings and update the models manually.
- `--folder` - this allows you to explicitly set the folder where the generated files should go. This is not recommended and instead you should use the .rc file (see below)

## `warthogrc` config file

Warthog uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) for config that shouldn't change between environments (so typically file paths). This means you can put any of the following config files in your project root:

- .warthogrc.json
- .warthogrc.yaml
- .warthogrc.js
- warthog.config.js file (exporting a JS object)

The following config options are currently available:

| Config Key      | Description                                                                  | Equivalent Environment Variable |
| --------------- | ---------------------------------------------------------------------------- | ------------------------------- |
| generatedFolder | Relative location to generated folder (relative path from the config file)   | WARTHOG_GENERATED_FOLDER        |
| cliGeneratePath | Where should CLI place generated files? (relative path from the config file) | WARTHOG_CLI_GENERATE_PATH       |
| resolversPath   | Where should Warthog look for resolvers? (comma-delimited list of regexes)   | WARTHOG_RESOLVERS_PATH          |

Note that for `cliGeneratePath`, you can interpolate in the following strings to generate dynamic paths:

- `className` (pascal case)
- `camelName` (camel case)
- `kebabName` (kebab case)

Example:

```json
{
  "cliGeneratePath": "./src/${kebabName}"
}
```

Running `yarn warthog generate featureFlag` would create 3 files in the `./src/feature-flag/` folder. See [feature-flag example](./examples/7-feature-flags/warthog.config.js) for a live example.

## Usage in Production

It is recommended that you not run Warthog's TypeScript files via `ts-node` in Production as we do in development as `ts-node` has been known to cause issues in some smaller AWS instances. Instead, compile down to JS and run in `node`. For a full project example (using [dotenvi](https://github.com/b3ross/dotenvi) for config management), see [warthog-starter](https://github.com/goldcaddy77/warthog-starter)

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
