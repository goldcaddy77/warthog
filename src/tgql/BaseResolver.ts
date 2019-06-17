import { DeepPartial, Repository } from 'typeorm';

import { BaseModel, BaseService, WhereInput } from '../core';

import { StandardDeleteResponse } from './DeleteResponse';

export class BaseResolver<E extends BaseModel> {
  service: any;

  // TODO: need to figure out why we couldn't type this as Repository<E>
  constructor(protected entityClass: any, protected repository: Repository<E>) {
    this.service = new BaseService<E>(entityClass, this.repository);
  }

  async find<W extends WhereInput>(
    where?: any,
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
    return this.service.create(data, userId);
  }

  async createMany(data: Array<DeepPartial<E>>, userId: string): Promise<E[]> {
    return this.service.createMany(data, userId);
  }

  async update<W extends any>(data: DeepPartial<E>, where: W, userId: string): Promise<E> {
    return this.service.update(data, where, userId);
  }

  async delete<W extends any>(where: W, userId: string): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}
