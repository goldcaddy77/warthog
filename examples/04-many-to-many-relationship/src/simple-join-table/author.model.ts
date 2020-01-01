import { BaseModel, Model, OneToMany, StringField } from '@warthog/core';

import { Post } from './post.model';

@Model()
export class Author extends BaseModel {
  @StringField()
  firstName?: string;

  @OneToMany(
    () => Post,
    post => post.user
  )
  posts?: Post[];
}
