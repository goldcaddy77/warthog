import { BaseModel, Model, ManyToMany, StringField } from '../../../src';

import { UserRole } from './user-role.entity';

@Model()
export class Role extends BaseModel {
  @StringField()
  name?: string;

  @ManyToMany(() => UserRole, userRole => userRole.roles)
  userRoles?: UserRole[];
}
