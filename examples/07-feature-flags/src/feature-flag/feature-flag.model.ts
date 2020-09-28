import { BaseModel, ManyToOne, Model, OneToMany, StringField } from 'warthog';

import { Project } from '../project/project.model';

import { FeatureFlagSegment } from '../feature-flag-segment/feature-flag-segment.model';
import { FeatureFlagUser } from '../feature-flag-user/feature-flag-user.model';

@Model()
export class FeatureFlag extends BaseModel {
  @StringField({ maxLength: 50, minLength: 2, nullable: false })
  name: string;

  @StringField({ maxLength: 50, minLength: 2, nullable: false })
  key: string;

  @StringField({ maxLength: 20, minLength: 3, nullable: false })
  projKey: string;

  // TODO: this should not be nullable
  // TODO: this should not be exposed through the GraphQL either
  // TODO: should create "ManyToOneByKey" to join tables by a non-ID key
  @ManyToOne(
    () => Project,
    (project: Project) => project.featureFlags,
    {
      skipGraphQLField: true,
      nullable: true
    }
  )
  project?: Project;

  @OneToMany(
    () => FeatureFlagUser,
    (featureFlagUser: FeatureFlagUser) => featureFlagUser.featureFlag
  )
  featureFlagUsers?: FeatureFlagUser[];

  @OneToMany(
    () => FeatureFlagSegment,
    (featureFlagSegment: FeatureFlagSegment) => featureFlagSegment.featureFlag
  )
  featureFlagSegments?: FeatureFlagSegment[];
}
