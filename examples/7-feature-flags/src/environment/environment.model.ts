import { BaseModel, ManyToOne, Model, OneToMany, StringField } from '../../../../src';

// import { FeatureFlagSegment, FeatureFlagUser, Project, Segment, UserSegment } from '../models';
import { FeatureFlagSegment } from '../feature-flag-segment/feature-flag-segment.model';
import { FeatureFlagUser } from '../feature-flag-user/feature-flag-user.model';
import { Project } from '../project/project.model';
import { Segment } from '../segment/segment.model';
import { UserSegment } from '../user-segment/user-segment.model';

@Model()
// TODO: Unique key+projectKey
export class Environment extends BaseModel {
  @StringField({ maxLength: 50, minLength: 3, nullable: false })
  name: string;

  @StringField({ maxLength: 20, minLength: 3, nullable: false })
  key: string;

  @StringField({ maxLength: 20, minLength: 3, nullable: false })
  projKey: string;

  // TODO: this should not be nullable
  // TODO: this should not be exposed through the GraphQL either
  // TODO: should create "ManyToOneByKey" to join tables by a non-ID key
  @ManyToOne(() => Project, (project: Project) => project.environments, { skipGraphQLField: true, nullable: true })
  project?: Project;

  @OneToMany(() => Segment, (segment: Segment) => segment.environment)
  segments?: Environment[];

  @OneToMany(() => FeatureFlagUser, (featureFlagUser: FeatureFlagUser) => featureFlagUser.environment)
  featureFlagUsers?: FeatureFlagUser[];

  @OneToMany(() => FeatureFlagSegment, (featureFlagSegment: FeatureFlagSegment) => featureFlagSegment.environment)
  featureFlagSegments?: FeatureFlagSegment[];

  @OneToMany(() => UserSegment, (userSegments: UserSegment) => userSegments.environment)
  userSegments?: UserSegment[];
}
