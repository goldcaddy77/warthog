import { nanoid } from 'nanoid';
import { ObjectType } from 'type-graphql';
import { BeforeInsert } from 'typeorm';
import { IDType } from '../core';
import {
  CreatedAtField,
  CreatedByField,
  DeletedAtField,
  DeletedByField,
  OwnerIdField,
  PrimaryIdField,
  UpdatedAtField,
  UpdatedByField,
  VersionField
} from '../decorators';

// type-graphql requires you set this as ObjectType for it's inheritance to work
@ObjectType({ isAbstract: true })
export abstract class IdModel {
  @PrimaryIdField({ filter: ['in'] })
  id!: IDType;

  getId(): string {
    // If settings allow ID to be specified on create, use the specified ID
    return this.id || nanoid();
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

// type-graphql requires you set this as ObjectType for it's inheritance to work
@ObjectType({ isAbstract: true })
export class BaseModel extends IdModel {
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

  @OwnerIdField()
  ownerId!: IDType;

  // In the base case, this will already be set by BaseModel
  // Setting this up so that child classes can override the default behavior
  // applying a separate owner than the logged in user
  // Example of where this would be used: an admin or superuser could create items and assign owners
  getOwnerId(): string {
    return this.ownerId;
  }

  @BeforeInsert()
  setOwnerId(): void {
    this.ownerId = this.getOwnerId();
  }
}
