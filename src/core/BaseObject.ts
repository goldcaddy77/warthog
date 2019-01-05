import * as shortid from 'shortid';
import { Field, Int, InterfaceType, ObjectType } from 'type-graphql';
import { BeforeInsert, Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

import { ID } from '.';

// tslint:disable:max-classes-per-file

// This interface adds all of the base type-graphql fields to our BaseClass
@InterfaceType()
export abstract class BaseGraphQLObject {
  @Field(type => String)
  id!: ID;

  @Field() createdAt!: Date;
  @Field() createdById?: ID;

  @Field({ nullable: true })
  updatedAt?: Date;
  @Field({ nullable: true })
  updatedById?: ID;

  @Field({ nullable: true })
  deletedAt?: Date;
  @Field({ nullable: true })
  deletedById?: ID;

  @Field(type => Int)
  version!: number;
}

// This class adds all of the TypeORM decorators needed to create the DB table
@ObjectType({ implements: BaseGraphQLObject })
export abstract class BaseObject implements BaseGraphQLObject {
  @PrimaryColumn({ type: String })
  id!: ID;

  @CreateDateColumn() createdAt!: Date;
  @Column() createdById!: ID;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;
  @Column({ nullable: true })
  updatedById?: ID;

  @Column({ nullable: true })
  deletedAt?: Date;
  @Column({ nullable: true })
  deletedById?: ID;

  @VersionColumn() version!: number;

  @BeforeInsert()
  setId() {
    this.id = shortid.generate();
  }
}

// tslint:enable:max-classes-per-file
