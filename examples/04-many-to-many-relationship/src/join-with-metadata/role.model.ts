import { BaseModel, Model, OneToMany, StringField } from '@warthog/core';

import { UserRole } from './user-role.model';

@Model()
export class Role extends BaseModel {
  @StringField()
  name?: string;

  @OneToMany(
    () => UserRole,
    (userRole: UserRole) => userRole.role
  )
  userRoles?: UserRole[];
}
