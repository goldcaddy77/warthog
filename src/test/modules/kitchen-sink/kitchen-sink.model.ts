import { Column } from 'typeorm';

import {
  BaseModel,
  BooleanField,
  CustomField,
  DateField,
  EmailField,
  // EnumField,
  FloatField,
  IdField,
  IntField,
  JSONField,
  OneToMany,
  Model,
  NumericField,
  StringField,
  JsonObject
} from '../../../';

import { Dish } from '../dish/dish.model';

// Note: this must be exported and in the same file where it's attached with @EnumField
// Also - must use string enums
// export enum StringEnum {
//   FOO = 'FOO',
//   BAR = 'BAR'
// }

@Model()
export class KitchenSink extends BaseModel {
  @StringField()
  stringField?: string;

  @StringField({ nullable: true })
  nullableStringField?: string;

  @DateField({ nullable: true })
  dateField?: Date;

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

  @OneToMany(() => Dish, (dish: Dish) => dish.kitchenSink)
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

  @StringField({ dataType: 'character', nullable: true })
  characterField?: string;

  @CustomField({
    api: { type: 'string', nullable: true, sort: false, filter: false },
    db: { type: 'text', nullable: true }
  })
  customTextFieldNoSortOrFilter?: string;

  // @EnumField('StringEnum', StringEnum)
  // stringEnumField: StringEnum;
}
