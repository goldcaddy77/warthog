<p align="center">
  <a href="http://warthog.dev/"><img src="./img/warthog-logo.png" width="400" alt="Warthog Logo"></a>
</p>

 <p align="center">
   Node.js <a href="https://graphql.org" target="_blank">GraphQL</a> Framework for building APIs with strong conventions through auto-generated code.  With Warthog, set up your data models and resolvers, and it does the rest.
</p>

<p align="center">
  <a href="https://www.npmjs.org/package/warthog"><img src="https://img.shields.io/npm/v/warthog.svg" alt="npm version"></a>
  <a href="https://circleci.com/gh/goldcaddy77/warthog/tree/master"><img src="https://circleci.com/gh/goldcaddy77/warthog/tree/master.svg?style=shield" alt="CircleCI"></a>
  <a href="https://codecov.io/gh/goldcaddy77/warthog"><img src="https://codecov.io/gh/goldcaddy77/warthog/branch/master/graph/badge.svg" alt="styled with prettier"></a>
  <a href="#badge"><img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg" alt="styled with prettier"></a>
  <a href="https://github.com/semantic-release/semantic-release"><img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg" alt="semantic-release"></a>
  <a href="https://gitter.im/warthog-graphql/community?utm_source=badge&amp;utm_medium=badge&amp;utm_campaign=pr-badge&amp;utm_content=badge"><img src="https://badges.gitter.im/warthog-graphql/community.svg" alt="Join the chat at https://gitter.im/warthog-graphql/community"></a>
</p>

## Summary

Warthog is a [Node.js](http://nodejs.org) GraphQL API framework for quickly building consistent GraphQL APIs that have sorting, filtering and pagination out of the box.  It is written in [TypeScript](http://www.typescriptlang.org) and makes heavy use of decorators for concise, declaritive code.

## Philosophy

This library is intentionally opinionated and generates as much code as possible.  When teams build products quickly, even if they have strong conventions and good linters, the GraphQL can quickly become inconsistent, making it difficult for clients to consume the APIs in a reusable way.

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

## Warning

The API for this library is still subject to change.  It will likely shift until version 2, at which time it will become stable.  I'd love early adopters, but please know that there might be some breaking changes until v2.

## Prerequisites

You must have Postgresql installed to use Warthog.  If you already have it installed, you can skip this step, otherwise there are 3 options:

### Docker

See the [warthog-starter](https://github.com/goldcaddy77/warthog-starter/pull/6/files) project for how to use Docker to run Postgres.

### Homebrew

If you're on OSX and have [Homebrew](https://brew.sh/) installed, you can simply run:

```bash
brew install postgresql
`brew --prefix`/opt/postgres/bin/createuser -s postgres
```

### Postgres.app

Otherwise, you can install [Postgres.app](https://postgresapp.com/) or use the Google machine to figure out how to install on your OS.

## Usage

The easiest way to start using Warthog for a fresh project is to clone the [warthog-starter](https://github.com/goldcaddy77/warthog-starter) repo.  This has a simple example in place to get you started.  There are also a bunch of examples in the [examples](./examples/README.md) folder for more advanced use cases.

Note that the examples in the [examples](./examples/README.md) folder use relative import paths to call into Warthog.  In your projects, you won't need to set this config value as it's only set to deal with the fact that it's using the Warthog core files without consuming the package from NPM.  In your projects, you can omit this as I do in [warthog-starter](https://github.com/goldcaddy77/warthog-starter).

### Installing in Existing Project

```bash
yarn add warthog
```

### 1. Create a Model

The model will auto-generate your database table and graphql types.  Warthog will find all models that match the following glob - `'/**/*.model.ts'`.  So for this file, you would name it `user.model.ts`

```typescript
import { BaseModel, Model, StringField } from 'warthog';

@Model()
export class User extends BaseModel {
  @StringField()
  name?: string;
}
```

### 2. Create a Resolver

The resolver auto-generates queries and mutations in your GraphQL schema.  Warthog will find all resolvers that match the following glob - `'/**/*.resolver.ts'`.  So for this file, you would name it `user.resolver.ts`

```typescript
import { User } from './user.model';

@Resolver(User)
export class UserResolver extends BaseResolver<User> {
  constructor(@InjectRepository(User) public readonly userRepository: Repository<User>) {
    super(User, userRepository);
  }

  @Query(() => [User])
  async users(
    @Args() { where, orderBy, limit, offset }: UserWhereArgs
  ): Promise<User[]> {
    return this.find<UserWhereInput>(where, orderBy, limit, offset);
  }

  @Mutation(() => User)
  async createUser(@Arg('data') data: UserCreateInput, @Ctx() ctx: BaseContext): Promise<User> {
    return this.create(data, ctx.user.id);
  }
}
```

### 3. Add config to .env file

```env
WARTHOG_APP_HOST=localhost
WARTHOG_APP_PORT=4100
WARTHOG_DB_DATABASE=warthog
WARTHOG_DB_USERNAME=postgres
WARTHOG_DB_PASSWORD=
```

### 4. Run your server

```typescript

import 'reflect-metadata';
import { Server } from 'warthog';

async function bootstrap() {
  const server = new Server();
  return server.start();
}

bootstrap()
```

When you start your server, there will be a new `generated` folder that has your GraphQL schema in `schema.graphql`.  This contains:

```graphql
type User implements BaseGraphQLObject {
  id: String!
  createdAt: DateTime!
  createdById: String!
  updatedAt: DateTime
  updatedById: String
  deletedAt: DateTime
  deletedById: String
  version: Int!
  name: String!
}

input UserCreateInput {
  name: String!
}

enum UserOrderByInput {
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  deletedAt_ASC
  deletedAt_DESC
  name_ASC
  name_DESC
}

input UserUpdateInput {
  name: String
}

input UserWhereInput {
  id_eq: String
  id_in: [String!]
  createdAt_eq: String
  createdAt_lt: String
  createdAt_lte: String
  createdAt_gt: String
  createdAt_gte: String
  createdById_eq: String
  updatedAt_eq: String
  updatedAt_lt: String
  updatedAt_lte: String
  updatedAt_gt: String
  updatedAt_gte: String
  updatedById_eq: String
  deletedAt_all: Boolean
  deletedAt_eq: String
  deletedAt_lt: String
  deletedAt_lte: String
  deletedAt_gt: String
  deletedAt_gte: String
  deletedById_eq: String
  name_eq: String
  name_contains: String
  name_startsWith: String
  name_endsWith: String
  name_in: [String!]
}

input UserWhereUniqueInput {
  id: String!
}
```

Notice how we've only added a single field on the model and you get pagination, filtering and tracking of who created, updated and deleted records automatically.

## Server API

### App Options (appOptions)

| attribute         | description                                                                                               | default                                                 |
| ----------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| container         | TypeDI container. Warthog uses dependency injection under the hood.                                       | empty container                                         |
| authChecker       | An instance of an [AuthChecker](https://typegraphql.ml/docs/authorization.html) to secure your resolvers. |                                                         |
| autoGenerateFiles | Should the server auto-generate your schema, typings, etc...                                              | `true` when NODE_ENV=development. `false` otherwise     |
| context           | Context getter of form `(request: Request) => object`                                                     | empty                                                   |
| generatedFolder   | Folder where generated content is created                                                                 | `process.cwd()` + 'generated'                           |
| logger            | Logger                                                                                                    | [debug](https://github.com/visionmedia/debug)           |
| middlewares       | Express middlewares to add to your server                                                                 | none                                                    |
| mockDBConnection  | Opens a sqlite connection instead of Postgres.  Helpful if you just need to generate the schema           | `false`                                                 |
| openPlayground    | Should server open GraphQL Playground after starting?                                                     | `false` if running tests, `true` if in development mode |
| port              | App Server Port                                                                                           | 4000                                                    |
| resolversPath     | Glob path to find your resolvers                                                                          | `process.cwd()` + '/**/*.resolver.ts'                   |

## Config

All config is driven by environment variables.  Most options can also be set by setting the value when creating your `Server` instance.

| variable              | value                         | config option name | default |
| --------------------- | ----------------------------- | ------------------ | ------- |
| WARTHOG_APP_HOST      | App server host               | appOptions.host    | _none_  |
| WARTHOG_APP_PORT      | App server port               | appOptions.port    | 4000    |
| WARTHOG_DB_DATABASE   | DB name                       | _none_             | _none_  |
| WARTHOG_DB_USERNAME   | DB username                   | _none_             | _none_  |
| WARTHOG_DB_PASSWORD   | DB password                   | _none_             | _none_  |
| WARTHOG_MOCK_DATABASE | Should we use mock sqlite DB? | _none_             | false   |

## Field/Column Decorators

All of the auto-generation magic comes from the decorators added to the attributes on your models.  Warthog decorators are convenient wrappers around TypeORM decorators (to create DB schema) and TypeGraphQL (to create GraphQL schema).  You can find a list of decorators available in the [src/decorators](./src/decorators) folder.  Most of these are also used in the [examples](./examples) folder in this project.

If you need to add a column to the DB that does not need to be exposed via the API, you should just use [the TypeORM decorators](https://github.com/typeorm/typeorm/blob/master/docs/decorator-reference.md)

If you need to add a field that is only exposed via the API that is not DB-backed, you should just use [the TypeGraphQL Field Decorator](https://github.com/19majkel94/type-graphql/blob/master/src/decorators/Field.ts)

## Intentionally Opinionated

Warthog is intentionally opinionated to accelerate development and make use of technology-specific features:

- Postgres - currently the only database supported.  This could be changed, but choosing Postgres allows adding a docker container and other goodies easily.
- Jest - other harnesses will work, but if you use Jest, we will not open the GraphQL playground when the server starts, for example.
- Soft deletes - no records are ever deleted, only "soft deleted".  The base service used in resolvers filters out the deleted records by default.

## Thanks

Special thanks to:

- [TypeORM](https://github.com/typeorm/typeorm) - DB generation
- [TypeGraphQL](https://github.com/19majkel94/type-graphql) - GraphQL generation
- [Prisma](https://github.com/prisma/prisma) - [OpenCrud](https://github.com/opencrud/opencrud) conventions
- [richardbmx](https://github.com/richardbmx) - Logo design

Warthog is essentially a really opinionated composition of TypeORM and TypeGraphQL that uses similar GraphQL conventions to the Prisma project.

## Contribute

PRs accepted, fire away!  Or add issues if you have use cases Warthog doesn't cover.

## License

MIT © Dan Caddigan
