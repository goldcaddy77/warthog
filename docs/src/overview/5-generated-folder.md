---
name: Generated Folder
menu: Constructs
---

## Generated Folder

When you start your server, there will be a new `generated` folder that Warthog creates automatically. The folder contains:

### `classes.ts`

Warthog auto-generates this file from the metadata it collects (from decorators like `Model`, `Query`, `Resolver`, `StringField`, etc...). Resolvers will import items from here instead of having to manually create them.

### `schema.graphql`

This is auto-generated from our resolvers, models and `classes.ts` above. Check out [this example's schema.graphql](https://github.com/goldcaddy77/warthog/blob/master/examples/01-simple-model/generated/schema.graphql) to show the additional GraphQL schema Warthog autogenerates.

### `ormconfig.ts`

a TypeORM [ormconfig](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md) file.

### `binding.ts`

a [graphql-binding](https://www.prisma.io/docs/1.10/graphql-ecosystem/graphql-binding/graphql-binding-quaidah9ph) for type-safe programmatic access to your API (making real API calls)
