import { BaseModel, Model, OneToMany, StringField } from '@warthog/core';

import { UserRole } from './user-role.model';

@Model()
export class User extends BaseModel {
  @StringField()
  firstName?: string;

  @OneToMany(() => UserRole, userRole => userRole.user)
  userRoles?: UserRole[];
}
