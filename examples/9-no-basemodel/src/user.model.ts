import { MinimalModel, Model, StringField } from '../../../src';

@Model()
export class User extends MinimalModel {
  @StringField()
  firstName?: string;

  setId() {
    this.id = new Date().getTime().toString();
  }
}
