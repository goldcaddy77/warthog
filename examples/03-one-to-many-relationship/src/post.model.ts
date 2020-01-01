import { BaseModel, ManyToOne, Model, StringField } from '@warthog/core';

import { User } from './user.model';

@Model()
export class Post extends BaseModel {
  @StringField()
  title?: string;

  @ManyToOne(
    () => User,
    (user: User) => user.posts,
    { nullable: false }
  )
  user?: User;
}
