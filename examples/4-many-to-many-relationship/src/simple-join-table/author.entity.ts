import { BaseModel, Model, OneToMany, StringField } from '../../../../src';

import { Post } from './post.entity';

@Model()
export class Author extends BaseModel {
  @StringField()
  firstName?: string;

  @OneToMany(() => Post, post => post.user)
  posts?: Post[];
}
