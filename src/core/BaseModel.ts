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

// tslint:disable:max-classes-per-file

// This interface adds all of the base type-graphql fields to our BaseClass
@InterfaceType()
export abstract class BaseGraphQLObject {
  @Field(type => ID)
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

  @Field(type => Int)
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
    return shortid.generate();
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

// tslint:enable:max-classes-per-file
