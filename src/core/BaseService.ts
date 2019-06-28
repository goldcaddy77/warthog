import { DeepPartial, getRepository, Repository } from 'typeorm';

import { StandardDeleteResponse } from '../tgql';

import { BaseModel, WhereInput } from '..';
import { MinimalService } from './MinimalService';

export class BaseService<E extends BaseModel> {
  service: MinimalService<E>;

  // TODO: need to figure out why we couldn't type this as Repository<E>
  constructor(protected entityClass: any, protected repository: Repository<any>) {
    if (!entityClass) {
      throw new Error('BaseService requires an entity Class');
    }

    // TODO: This handles an issue with typeorm-typedi-extensions where it is unable to
    // Inject the proper repository
    if (!repository) {
      this.repository = getRepository(entityClass);
    }
    if (!repository) {
      throw new Error(`BaseService requires a valid repository, class ${entityClass}`);
    }

    this.service = new MinimalService(entityClass, repository);
  }

  async find<W extends WhereInput>(
    where?: W,
    orderBy?: any, // Fix this
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<E[]> {
    return this.service.find(where, orderBy, limit, offset, fields);
  }

  // TODO: fix - W extends Partial<E>
  async findOne<W extends any>(where: W): Promise<E> {
    return this.service.findOne(where);
  }

  async create(data: DeepPartial<E>, userId: string): Promise<E> {
    (data as any).createdById = userId; // TODO: fix any

    return this.service.create(data);
  }

  async createMany(data: DeepPartial<E>[], userId: string): Promise<E[]> {
    data = data.map(item => {
      return { ...item, createdById: userId };
    });

    return this.service.createMany(data);
  }

  // W extends Partial<E>
  async update<W extends any>(data: DeepPartial<E>, where: W, userId: string): Promise<E> {
    (data as any).updatedById = userId; // TODO: fix any

    return this.service.update(data, where);
  }

  async delete<W extends any>(
    where: W,
    userId: string,
    additionalData: DeepPartial<E>
  ): Promise<StandardDeleteResponse> {
    const data = {
      deletedById: userId,
      additionalData
    };

    return this.service.delete(where, data);
  }
}
