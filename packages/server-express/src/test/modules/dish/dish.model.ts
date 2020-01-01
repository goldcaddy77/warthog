import { BaseModel, ManyToOne, Model, StringField } from '@warthog/core';

import { KitchenSink } from '../kitchen-sink/kitchen-sink.model';

@Model()
export class Dish extends BaseModel {
  @StringField({ maxLength: 30 })
  name?: string;

  @ManyToOne(() => KitchenSink, (kitchenSink: KitchenSink) => kitchenSink.dishes, {
    nullable: false
  })
  kitchenSink?: KitchenSink;
}
