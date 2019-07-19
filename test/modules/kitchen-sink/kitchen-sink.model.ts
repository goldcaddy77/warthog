import {
  BaseModel,
  BooleanField,
  EmailField,
  // EnumField,
  FloatField,
  IntField,
  OneToMany,
  Model,
  StringField
} from '../../../src';

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

  @EmailField()
  emailField?: string;

  @IntField()
  integerField?: number;

  @BooleanField()
  booleanField?: boolean;

  @FloatField()
  floatField?: number;

  @OneToMany(() => Dish, (dish: Dish) => dish.kitchenSink)
  dishes?: Dish[];

  // @EnumField('StringEnum', StringEnum)
  // stringEnumField: StringEnum;
}
