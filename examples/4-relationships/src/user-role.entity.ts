import { BaseModel, ForeignKeyField, ManyToManyJoin, Model } from '../../../src/';

import { Role } from './role.entity';
import { User } from './user.entity';

@Model()
export class UserRole extends BaseModel {
  @ManyToManyJoin(() => User, user => user.userRoles)
  users?: User[];

  @ForeignKeyField() userId!: string;

  @ManyToManyJoin(() => Role, role => role.userRoles)
  roles?: Role[];

  @ForeignKeyField() roleId!: string;
}
