import {
  BaseModel,
  BooleanField,
  DateField,
  EmailField,
  // EnumField,
  FloatField,
  IntField,
  JSONField,
  OneToMany,
  Model,
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

  @OneToMany(
    () => Dish,
    (dish: Dish) => dish.kitchenSink
  )
  dishes!: Dish[];

  // @EnumField('StringEnum', StringEnum)
  // stringEnumField: StringEnum;
}
