---
name: generate
menu: Warthog CLI
---


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
