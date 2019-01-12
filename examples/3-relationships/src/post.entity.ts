import { BaseModel, ID, ManyToOne, Model, StringField } from '../../../src';

import { User } from './user.entity';

@Model()
export class Post extends BaseModel {
  @StringField()
  title?: string;

  @ManyToOne(() => User, user => user.posts, { nullable: false })
  user?: User;
}
