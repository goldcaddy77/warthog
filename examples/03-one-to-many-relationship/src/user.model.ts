import { BaseModel, Model, OneToMany, StringField } from 'warthog';

import { Post } from './post.model';

@Model()
export class User extends BaseModel {
  @StringField()
  firstName?: string;

  @OneToMany(
    () => Post,
    (post: Post) => post.user
  )
  posts?: Post[];
}
