import { BaseModel, Model, ManyToMany, StringField } from '../../../src';

import { UserRole } from './user-role.entity';

@Model()
export class User extends BaseModel {
  @StringField()
  firstName?: string;

  @ManyToMany(() => UserRole, userRole => userRole.users)
  userRoles?: UserRole[];
}
