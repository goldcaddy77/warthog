import { AuthChecker } from 'type-graphql';

import { BaseContext } from '../core/Context';

// This authChecker is used by type-graphql's @Authorized decorator
export const authChecker: AuthChecker<BaseContext> = ({ context: { user } }, permissions) => {
  if (!user) {
    return false;
  }

  // Just checking @Authorized() - return true since we know there is a user now
  if (user.permissions.length === 0) {
    return user !== undefined;
  }
  // Check that permissions overlap
  return permissions.some((perm: string) => user.permissions.includes(perm));
};
