---
name: Server
menu: Overview
---

## Server

Most of the config in Warthog is done via environment variables (see `Config - Environment Variables` below). However, more complex/dynamic objects should be passed via the server config.

| attribute                 | description                                                                                               | default                                       |
| ------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| container                 | TypeDI container. Warthog uses dependency injection under the hood.                                       | empty container                               |
| authChecker               | An instance of an [AuthChecker](https://typegraphql.ml/docs/authorization.html) to secure your resolvers. |                                               |
| context                   | Context getter of form `(request: Request) => object`                                                     | empty                                         |
| logger                    | Logger                                                                                                    | [debug](https://github.com/visionmedia/debug) |
| middlewares               | [TypeGraphQL](https://typegraphql.ml/docs/middlewares.html) middlewares to add to your server             | none                                          |
| onBeforeGraphQLMiddleware | Callback executed just before the Graphql server is started. The Express app is passed.                   | none                                          |
| onAfterGraphQLMiddleware  | Callback executed just after the Graphql server is started. The Express app is passed.                    | none                                          |
