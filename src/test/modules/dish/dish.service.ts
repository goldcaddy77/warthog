import { Service } from 'typedi';
import { DeepPartial, EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from '../../../';
import { Dish } from './dish.model';

@Service('DishService')
export class DishService extends BaseService<Dish> {
  constructor(@InjectRepository(Dish) protected readonly repository: Repository<Dish>) {
    super(Dish, repository);
  }

  @Transaction()
  async successfulTransaction(
    data: DeepPartial<Dish>,
    userId: string,
    @TransactionManager() manager?: EntityManager
  ): Promise<Dish[]> {
    const { id, ...nonTransactionUser } = await this.create(data, userId);

    const user1 = await this.create(data, userId, { manager });
    const user2 = await this.update(
      { ...nonTransactionUser, name: `${data.name} Updated` },
      { id },
      userId,
      {
        manager
      }
    );

    return [user1, user2];
  }

  // This opens the transaction automatically and either commits or rolls back based on whether the function
  // throws or not, so you must execute database calls in here, they cannot be returned like they are above.
  @Transaction()
  async failedTransaction(
    data: DeepPartial<Dish>,
    userId: string,
    @TransactionManager() manager?: EntityManager
  ): Promise<Dish[]> {
    const invalidUserData = {};

    const users = await Promise.all([
      this.create(data, userId, { manager }),
      this.create(invalidUserData, userId, { manager }) // This one fails
    ]);

    // You cannot return a promise here or else the transaction manager will think the transaction is good
    return users;
  }
}
