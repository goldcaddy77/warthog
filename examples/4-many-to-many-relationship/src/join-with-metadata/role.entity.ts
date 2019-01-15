import { BaseModel, Model, OneToMany, StringField } from '../../../../src';

import { UserRole } from './user-role.entity';

@Model()
export class Role extends BaseModel {
  @StringField()
  name?: string;

  @OneToMany(() => UserRole, userRole => userRole.role)
  userRoles?: UserRole[];
}
