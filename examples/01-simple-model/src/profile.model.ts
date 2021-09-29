import { BaseModel, Model, OneToOne, StringField } from '../../../src';
import { User } from './user.model';

@Model()
export class Profile extends BaseModel {
  @StringField()
  body?: string;

  @OneToOne(
    () => User,
    user => user.profile
  )
  user: User;
}
