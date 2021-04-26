import * as shortid from 'shortid';
import { ObjectType } from 'type-graphql';
import { BeforeInsert } from 'typeorm';

import {
  CreatedAtField,
  CreatedByField,
  DeletedAtField,
  DeletedByField,
  PrimaryIdField,
  UpdatedAtField,
  UpdatedByField,
  VersionField
} from '../decorators';
import { IDType } from '../core';

// type-graphql requires you set this as ObjectType for it's inheritance to work
@ObjectType({ isAbstract: true })
export class BaseModel {
  @PrimaryIdField()
  id!: IDType;

  @CreatedAtField()
  createdAt!: Date;

  @CreatedByField()
  createdById!: IDType;

  @UpdatedAtField()
  updatedAt!: Date;

  @UpdatedByField()
  updatedById!: IDType;

  @DeletedAtField()
  deletedAt!: Date;

  @DeletedByField()
  deletedById?: IDType;

  @VersionField()
  version!: number;

  getValue(field: string): string | number {
    const self = this as any;
    if (self[field] instanceof Date) {
      return self[field].toISOString();
    }
    return self[field];
  }

  getId(): string {
    // If settings allow ID to be specified on create, use the specified ID
    return this.id || shortid.generate();
  }

  @BeforeInsert()
  setId(): void {
    this.id = this.getId();
  }
}

// type-graphql requires you set this as ObjectType for it's inheritance to work
@ObjectType({ isAbstract: true })
export abstract class IdModel {
  @PrimaryIdField()
  id!: IDType;

  getId(): string {
    // If settings allow ID to be specified on create, use the specified ID
    return this.id || shortid.generate();
  }

  @BeforeInsert()
  setId(): void {
    this.id = this.getId();
  }

  getValue(field: string): string | number {
    const self = this as any;
    if (self[field] instanceof Date) {
      return self[field].toISOString();
    }
    return self[field];
  }
}
