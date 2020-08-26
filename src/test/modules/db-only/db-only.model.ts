import { BaseModel, Model, StringField } from '../../..';

@Model({ dbOnly: true })
export class DbOnly extends BaseModel {
  @StringField()
  stringField?: string;
}
