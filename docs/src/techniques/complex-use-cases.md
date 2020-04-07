---
name: Complex Use Cases
menu: Techniques
---

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
