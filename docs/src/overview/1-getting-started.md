---
name: Getting Started
menu: Constructs
---

## Installation

Add installation steps

## Prerequisites

Warthog currently only supports PostgreSQL as a DB engine (version 10, 11 or 12), so you must have Postgres installed before getting Warthog set up.

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

To install in an existing project, you'll need to create several files in place and then you'll need to call a few CLI commands that:

- Generate a new resource
- Create a database
- Create a DB migration and run it
- Run the server

The following code will get you bootstrapped. You should read through this before running:

```bash
# Add warthog so that we can use the CLI
yarn add warthog

# Bootstrap a new application using CLI
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
