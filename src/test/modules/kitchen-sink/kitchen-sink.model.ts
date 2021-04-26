import { Column } from 'typeorm';

import {
  BooleanField,
  CreatedAtField,
  CreatedByField,
  CustomField,
  DateField,
  DateOnlyField,
  DateOnlyString,
  DateTimeField,
  DateTimeString,
  DeletedAtField,
  DeletedByField,
  EmailField,
  EnumField,
  FloatField,
  IdField,
  IdModel,
  IDType,
  IntField,
  JSONField,
  JsonObject,
  OneToMany,
  Model,
  NumericField,
  PrimaryIdField,
  StringField,
  UpdatedAtField,
  UpdatedByField,
  VersionField
} from '../../../';

import { Dish } from '../dish/dish.model';

import { StringEnum } from '../shared';
export { StringEnum }; // Warthog requires this

@Model()
export class KitchenSink extends IdModel {
  @PrimaryIdField({ filter: ['eq', 'in'] })
  id!: IDType;

  @CreatedAtField()
  createdAt!: DateTimeString;

  @CreatedByField()
  createdById!: IDType;

  @UpdatedAtField()
  updatedAt!: DateTimeString;

  @UpdatedByField()
  updatedById!: IDType;

  @DeletedAtField()
  deletedAt!: DateTimeString;

  @DeletedByField()
  deletedById?: IDType;

  @VersionField()
  version!: number;

  @StringField({ description: 'This is a string field' })
  stringField?: string;

  @StringField({ nullable: true })
  nullableStringField?: string;

  @DateField({ nullable: true })
  dateField?: Date;

  @DateOnlyField({ nullable: true })
  dateOnlyField?: DateOnlyString;

  @DateTimeField({ nullable: true })
  dateTimeField?: DateTimeString;

  @EmailField()
  emailField!: string;

  @IntField()
  integerField?: number;

  @BooleanField()
  booleanField?: boolean;

  @FloatField()
  floatField?: number;

  @JSONField({ nullable: true })
  jsonField?: JsonObject;

  @IdField({ nullable: true })
  idField?: string;

  @EnumField('StringEnum', StringEnum, { nullable: true })
  stringEnumField?: StringEnum;

  @OneToMany(
    () => Dish,
    (dish: Dish) => dish.kitchenSink
  )
  dishes!: Dish[];

  @Column({ nullable: true })
  dbOnlyColumn?: string;

  @NumericField({ nullable: true })
  numericField?: number;

  @NumericField({ nullable: true, precision: 5, scale: 2 })
  numericFieldCustomPrecisionScale?: number;

  @StringField({ filter: false, nullable: true })
  noFilterField?: string;

  @StringField({ sort: false, nullable: true })
  noSortField?: string;

  @StringField({ filter: false, sort: false, nullable: true })
  noFilterOrSortField?: string;

  @StringField({ filter: ['eq', 'contains'], sort: false, nullable: true })
  stringFieldFilterEqContains?: string;

  @IntField({ filter: ['lte', 'gte'], sort: false, nullable: true })
  intFieldFilterLteGte?: number;

  @StringField({ dataType: 'character', nullable: true })
  characterField?: string;

  @CustomField({
    api: { type: 'string', nullable: true, sort: false, filter: false },
    db: { type: 'text', nullable: true }
  })
  customTextFieldNoSortOrFilter?: string;

  @CustomField({
    api: { type: 'string', nullable: true, sort: false, filter: false },
    db: { type: 'text', nullable: true, array: true }
  })
  customFieldArrayColumn?: string[];

  @CustomField({
    api: { type: 'string', nullable: true, sort: false, filter: false, readonly: true },
    db: { type: 'text', nullable: true, default: 'foobar' }
  })
  customTextFieldReadOnly?: string;

  @StringField({ readonly: true, nullable: true })
  readonlyField?: string;

  @StringField({ writeonly: true, nullable: true })
  writeonlyField?: string;

  @StringField({ dbOnly: true, nullable: true })
  dbOnlyField?: string;

  @StringField({ apiOnly: true, nullable: true })
  apiOnlyField?: string;

  @StringField({ array: true, nullable: true })
  arrayOfStrings!: string[];

  @IntField({ array: true, nullable: true })
  arrayOfInts!: number[];
}
