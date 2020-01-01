import { BaseModel, Model, OneToMany, StringField } from '@warthog/core';

import { Author } from './author.model';

@Model()
export class Post extends BaseModel {
  @StringField()
  name?: string;

  @OneToMany(
    () => Author,
    author => author.role
  )
  authors?: Author[];
}
