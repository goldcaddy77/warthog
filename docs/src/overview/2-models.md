---
name: Models
menu: Overview
---

## Models

A model represents both a GraphQL type and a DB table. Warthog exposes a [BaseModel](https://github.com/goldcaddy77/warthog/blob/master/src/core/BaseModel.ts) class that provides the following columns for free: `id`, `createdAt`, `createdById`, `updatedAt`, `updatedById`, `deletedAt`, `deletedById`, `version`. If you use BaseModel in conjunction with BaseService (see below), all of these columns will be updated as you'd expect. The Warthog server will find all models that match the following glob - `'/**/*.model.ts'`. Ex: `user.model.ts`

Custom [TypeORM](https://github.com/typeorm/typeorm/blob/master/docs/decorator-reference.md#entity) and [TypeGraphQL](https://typegraphql.ml/docs/types-and-fields.html) options may be passed into the `Model` decorator using the following signature.

```javascript
@Model({ api: { description: 'Custom description' }, db: { name: 'customtablename' } })
```

## Field/Column Decorators

All of the auto-generation magic comes from the decorators added to the attributes on your models. Warthog decorators are convenient wrappers around TypeORM decorators (to create DB schema) and TypeGraphQL (to create GraphQL schema). You can find a list of decorators available in the [src/decorators](./src/decorators) folder. Most of these are also used in the [examples](./examples) folder in this project.

### StringField

### BooleanField
