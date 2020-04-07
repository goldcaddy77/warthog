---
name: Production
menu: Techniques
---

## Production

It is recommended that you not run Warthog's TypeScript files via `ts-node` in Production as we do in development as `ts-node` has been known to cause issues in some smaller AWS instances. Instead, compile down to JS and run in `node`. For a full project example (using [dotenvi](https://github.com/b3ross/dotenvi) for config management), see [warthog-starter](https://github.com/goldcaddy77/warthog-starter)

## DB Migration Workflow
