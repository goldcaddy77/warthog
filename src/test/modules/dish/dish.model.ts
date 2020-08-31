import { BaseModel, EnumField, ManyToOne, Model, StringField } from '../../../';

import { KitchenSink } from '../kitchen-sink/kitchen-sink.model';

import { StringEnum } from '../shared';
export { StringEnum }; // Warthog requires this

@Model()
export class Dish extends BaseModel {
  @StringField({ maxLength: 40 })
  name?: string;

  // Exercises the case where multiple models import the same enum
  @EnumField('StringEnum', StringEnum, { nullable: true })
  stringEnumField?: StringEnum;

  @ManyToOne(
    () => KitchenSink,
    (kitchenSink: KitchenSink) => kitchenSink.dishes,
    {
      nullable: false
    }
  )
  kitchenSink?: KitchenSink;
}
