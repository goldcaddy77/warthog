import { BaseModel, Model, OneToMany, StringField } from '@warthog/core';

import { Post } from './post.model';

@Model()
export class User extends BaseModel {
  @StringField()
  firstName?: string;

  @OneToMany(() => Post, post => post.user)
  posts?: Post[];
}
