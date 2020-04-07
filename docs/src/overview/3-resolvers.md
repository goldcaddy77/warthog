---
name: Resolvers
menu: Constructs
---

## Resolvers

A Warthog resolver exposes queries (reading data) and mutations (writing data). They interact with the DB through `services` (described below) and typically make use of a bunch of auto-generated TypeScript types in the `generated` folder for things like sorting and filtering. Warthog will find all resolvers that match the following glob - `'/**/*.resolver.ts'`. Ex: `user.resolver.ts`
