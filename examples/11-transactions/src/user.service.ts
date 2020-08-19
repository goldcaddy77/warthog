import { BaseService } from '@warthog/core';
import { Service } from 'typedi';
import { DeepPartial, Repository, Transaction, TransactionManager, EntityManager } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { User } from './user.model';

@Service('UserService')
export class UserService extends BaseService<User> {
  constructor(@InjectRepository(User) protected readonly repository: Repository<User>) {
    super(User, repository);
  }

  @Transaction()
  async successfulTransaction(
    data: DeepPartial<User>,
    userId: string,
    @TransactionManager() manager?: EntityManager
  ): Promise<User[]> {
    // Per comment below, this should also be executed in an `await` or else something could go wrong and the
    // items would be done outside the transaction
    return Promise.all([
      this.create(data, userId, { manager }),
      this.create(data, userId, { manager })
    ]);
  }

  // This opens the transaction automatically and either commits or rolls back based on whether the function
  // throws or not, so you must execute database calls in here, they cannot be returned like they are above.
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

    // You cannot return a promise here or else the transaction manager will think the transaction is good
    return users;
  }
}
