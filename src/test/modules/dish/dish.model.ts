import { BeforeInsert } from 'typeorm';
import {
  EnumField,
  generateId,
  CreatedAtField,
  DateTimeString,
  IDType,
  ManyToOne,
  Model,
  PrimaryIdField,
  StringField
} from '../../../';
import { KitchenSink } from '../kitchen-sink/kitchen-sink.model';
import { StringEnum } from '../shared';
export { StringEnum }; // Warthog requires this

@Model()
export class Dish {
  @PrimaryIdField({ sort: false, filter: ['in'] })
  id!: IDType;

  @BeforeInsert()
  setId() {
    this.id = this.id || generateId();
  }

  @CreatedAtField({ sort: true })
  createdAt!: DateTimeString;

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
