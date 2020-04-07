---
name: Services
menu: Overview
---

## Services

Services are the glue between resolvers and models. Warthog's convention is to name services `<model-name>.service.ts`. Ex: `user.service.ts`

```typescript
import { Service } from 'typedi';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from 'warthog';

import { User } from './user.model';

@Service('UserService')
export class UserService extends BaseService<User> {
  constructor(@InjectRepository(User) protected readonly repository: Repository<User>) {
    super(User, repository);
  }
}
```

### `BaseService` Class

Warthog exposes a class called [BaseService](https://github.com/goldcaddy77/warthog/blob/master/src/core/BaseService.ts) that exposes the following methods: `find`, `findOne`, `create`, `update`, `delete`. For the `find` operator, it also maps the auto-generated `WhereInput` attributes to the appropriate TypeORM Query Builders.
