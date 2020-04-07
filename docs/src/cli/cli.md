---
name: CLI Overview
menu: CLI
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
