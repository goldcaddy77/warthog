import { BaseModel, ManyToOne, Model, StringField } from '../../../../../src';
import { User } from '../user/user.model';

@Model()
export class Post extends BaseModel {
  @StringField()
  title!: string;

  @ManyToOne(
    () => User,
    (user: User) => user.posts,
    { nullable: false }
  )
  user?: User;
}
