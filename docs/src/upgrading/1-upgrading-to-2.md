---
name: Upgrading to 2.0
menu: Upgrading
---

Warthog is now on version 2.0! There were a few breaking changes that you should consider while upgrading. Also, we tried to keep all new features development on v1, but did end up adding JSON filtering directly to 2.0 as it was much easier given some foundation refactors.

### More specific scalars

A few fields have been updated to use more specific GraphQL scalars:

- ID fields: previously these were represented by type `String`. Dates now use type `ID`
- Date fields: previously these were represented by type `String`. Dates now use type `DateTime`

Since your GraphQL schema has changed and so have the associated TypeScript types in `classes.ts`, there might be changes in your server code and even perhaps some associated client code if you use these generated classes in your client code.

### `mockDBConnection` has been removed

The old codegen pipeline used TypeORM's metadata in order to generate the GraphQL schema since Warthog didn't also capture this metadata. Warthog now captures the necessary metadata, so we no longer need to lean on TypeORM and therefore we don't need the `mockDBConnection` we previously used during codegen. Searching your codebase for `mockDBConnection` and `WARTHOG_MOCK_DATABASE`/`MOCK_DATABASE` should do it. If you've been using the Warthog CLI for codegen, you shouldn't have anything to do here.

### Project Dependencies Updated

Staying on the latest versions of libraries is good for security, performance and new features. We've bumped to the latest stable versions of each of Warthog's dependencies. This might require some changes to your package.json.
