---
name: Transactions
menu: Techniques
---

## Transactions

There are a few ways to handle transactions in the framework, depending if you want to use `BaseService` or use your repositories directly.

### Using BaseService

To wrap BaseService operations in a transaction, you do 3 things:

1. Create a function decorated with the `@Transaction` method decorator
2. Inject `@TransactionManager` as a function parameter
3. Pass the `@TransactionManager` into calls to `BaseService`

#### @Transaction method decorator

The `@Transaction` decorator opens up a new transaction that is then available via the `@TransactionManager`. It will automatically close the transaction when the function returns, so it is important to `await` your service calls and not return a promise in this function.

```typescript
  @Transaction()
  async createTwoItems() {
    // ...
  }
```

#### @TransactionManager decorator

The `@TransactionManager` is essentially the same as a TypeORM EntityManger, except it wraps everything inside of it's transaction.

```typescript
  @Transaction()
  async createTwoItems(
        @TransactionManager() manager?: EntityManager
  ) {
    // ...
  }
```

#### Pass manager to BaseService

You can pass the entity manager into any of the `BaseService` methods to ensure they're part of the transaction.

```typescript
  @Transaction()
  async createTwoItems(
        @TransactionManager() manager?: EntityManager
  ) {
    this.create(data, userId, { manager })
  }
```

#### Example

```typescript
@Service('UserService')
export class UserService extends BaseService<User> {
  constructor(@InjectRepository(User) protected readonly repository: Repository<User>) {
    super(User, repository);
  }

  // GOOD: successful transaction
  @Transaction()
  async successfulTransaction(
    data: DeepPartial<User>,
    userId: string,
    @TransactionManager() manager?: EntityManager
  ): Promise<User[]> {
    return Promise.all([
      this.create(data, userId, { manager }),
      this.create(data, userId, { manager })
    ]);
  }

  // GOOD: successful rollback when something errors
  @Transaction()
  async failedTransaction(
    data: DeepPartial<User>,
    userId: string,
    @TransactionManager() manager?: EntityManager
  ): Promise<User[]> {
    const invalidUserData = {};

    const users = await Promise.all([
      this.create(data, userId, { manager }),
      this.create(invalidUserData, userId, { manager }) // This one fails
    ]);

    return users;
  }

  // BAD: you can't return a promise here.  The function will return and the first
  // user will be saved even though the 2nd one fails
  @Transaction()
  async failedTransaction(
    data: DeepPartial<User>,
    userId: string,
    @TransactionManager() manager?: EntityManager
  ): Promise<User[]> {
    return await Promise.all([
      this.create(data, userId, { manager }),
      this.create(invalidUserData, userId, { manager })
    ]);
  }
}
```

See the [TypeORM Transaction Docs](https://github.com/typeorm/typeorm/blob/master/docs/transactions.md#transaction-decorators) for more info.
