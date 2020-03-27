import { BaseModel, Model, OneToMany, StringField } from '../../../../src';

import { UserRole } from './user-role.model';

@Model()
export class User extends BaseModel {
  @StringField()
  firstName?: string;

  @OneToMany(
    () => UserRole,
    (userRole: UserRole) => userRole.user
  )
  userRoles?: UserRole[];
}
