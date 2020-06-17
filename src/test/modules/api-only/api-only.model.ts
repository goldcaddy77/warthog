import { BaseModel, Model, StringField } from '../../..';

@Model({ db: false })
export class ApiOnly extends BaseModel {
  @StringField()
  name?: string;
}
