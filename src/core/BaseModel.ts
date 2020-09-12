import * as shortid from 'shortid';
import { Field, ID, Int, InterfaceType, ObjectType } from 'type-graphql';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn
} from 'typeorm';

import { IDType } from './types';

// This interface adds all of the base type-graphql fields to our BaseClass
@InterfaceType()
export abstract class BaseGraphQLObject {
  @Field(() => ID)
  id!: IDType;

  @Field() createdAt!: Date;
  @Field() createdById?: IDType;

  @Field({ nullable: true })
  updatedAt?: Date;
  @Field({ nullable: true })
  updatedById?: IDType;

  @Field({ nullable: true })
  deletedAt?: Date;
  @Field({ nullable: true })
  deletedById?: IDType;

  @Field(() => Int)
  version!: number;
}

// This class adds all of the TypeORM decorators needed to create the DB table
@ObjectType({ implements: BaseGraphQLObject })
export abstract class BaseModel implements BaseGraphQLObject {
  @PrimaryColumn({ type: String })
  id!: IDType;

  @CreateDateColumn() createdAt!: Date;
  @Column() createdById!: IDType;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;
  @Column({ nullable: true })
  updatedById?: IDType;

  @Column({ nullable: true })
  deletedAt?: Date;
  @Column({ nullable: true })
  deletedById?: IDType;

  @VersionColumn() version!: number;

  getId() {
    // If settings allow ID to be specified on create, use the specified ID
    return this.id || shortid.generate();
  }

  // V3: DateTime should use getter to return ISO8601 string
  getValue(field: any) {
    const self = this as any;
    if (self[field] instanceof Date) {
      return self[field].toISOString();
    }
    return self[field];
  }

  @BeforeInsert()
  setId() {
    this.id = this.getId();
  }
}

// This class adds all of the TypeORM decorators needed to create the DB table
@ObjectType({ implements: BaseGraphQLObject })
export abstract class BaseModelUUID implements BaseGraphQLObject {
  @PrimaryGeneratedColumn('uuid')
  id!: IDType;

  @CreateDateColumn() createdAt!: Date;
  @Column() createdById!: IDType;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;
  @Column({ nullable: true })
  updatedById?: IDType;

  @Column({ nullable: true })
  deletedAt?: Date;
  @Column({ nullable: true })
  deletedById?: IDType;

  @VersionColumn() version!: number;
}

@ObjectType({ isAbstract: true })
export abstract class IdModel {
  @Field(() => ID)
  @PrimaryColumn({ type: String })
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
