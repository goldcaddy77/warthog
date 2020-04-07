---
name: CLI
route: /cli
---

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
