import { IDType, Model, PrimaryIdField, StringField } from '../../..';

@Model({ db: false })
export class ApiOnly {
  @PrimaryIdField({ filter: ['eq', 'in'] })
  id!: IDType;

  @StringField()
  name?: string;
}
