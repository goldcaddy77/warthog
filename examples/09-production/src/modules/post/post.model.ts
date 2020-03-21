import { BaseModel, ManyToOne, Model, StringField } from '../../../../../src';

import { User } from '../user/user.model';

@Model()
export class Post extends BaseModel {
  @StringField({ maxLength: 256 })
  title?: string;

  @ManyToOne(
    () => User,
    user => user.posts,
    { nullable: false }
  )
  user?: User;
}
