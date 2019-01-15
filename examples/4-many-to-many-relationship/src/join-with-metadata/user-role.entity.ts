import { BaseModel, ManyToOne, Model, StringField } from '../../../../src';

import { Role } from './role.entity';
import { User } from './user.entity';

// This is a modified many-to-many table that also allows
// for additional metadata as a typical many-to-many is just
// a lightweight join table with the foreign keys
@Model()
export class UserRole extends BaseModel {
  @ManyToOne(() => User, user => user.userRoles)
  user?: User;

  @ManyToOne(() => Role, role => role.userRoles)
  role?: Role;

  @StringField({ nullable: true })
  otherMetadata?: string;
}
