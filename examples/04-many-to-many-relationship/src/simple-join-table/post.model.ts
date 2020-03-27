import { BaseModel, Model, OneToMany, StringField } from '../../../../src';

import { Author } from './author.model';

@Model()
export class Post extends BaseModel {
  @StringField()
  name?: string;

  @OneToMany(
    () => Author,
    (author: Author) => author.posts
  )
  authors?: Author[];
}
