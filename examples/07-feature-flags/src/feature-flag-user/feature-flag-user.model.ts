import { BaseModel, ManyToOne, Model, StringField } from '@warthog/core';

import { Environment } from '../environment/environment.model';
import { FeatureFlag } from '../feature-flag/feature-flag.model';
import { Project } from '../project/project.model';
import { User } from '../user/user.model';

@Model()
export class FeatureFlagUser extends BaseModel {
  @StringField({ maxLength: 20, minLength: 3, nullable: false })
  featureKey: string;

  @ManyToOne(() => FeatureFlag, (featureFlag: FeatureFlag) => featureFlag.featureFlagUsers, {
    nullable: true,
    skipGraphQLField: true
  })
  featureFlag?: FeatureFlag;

  @StringField({ maxLength: 20, minLength: 3, nullable: false })
  userKey: string;

  @ManyToOne(() => User, (user: User) => user.featureFlagUsers, {
    skipGraphQLField: true,
    nullable: true
  })
  user?: User;

  @StringField({ maxLength: 20, minLength: 3, nullable: false })
  projKey: string;

  @ManyToOne(() => Project, (project: Project) => project.featureFlagUsers, {
    skipGraphQLField: true,
    nullable: true
  })
  project?: Project;

  @StringField({ maxLength: 20, minLength: 3, nullable: false })
  envKey: string;

  @ManyToOne(() => Environment, (environment: Environment) => environment.featureFlagUsers, {
    nullable: true,
    skipGraphQLField: true
  })
  environment?: Environment;
}
