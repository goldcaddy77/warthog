import { BaseModel, ManyToOne, Model, OneToMany, StringField } from '../../../../src';

// import { Environment, FeatureFlagSegment, Project, UserSegment } from '../models';
import { Environment } from '../environment/environment.model';
import { FeatureFlagSegment } from '../feature-flag-segment/feature-flag-segment.model';
import { Project } from '../project/project.model';
import { UserSegment } from '../user-segment/user-segment.model';

@Model()
export class Segment extends BaseModel {
  @StringField({ maxLength: 50, minLength: 3, nullable: false })
  name: string;

  @StringField({ maxLength: 20, minLength: 3, nullable: false })
  key: string;

  @StringField({ maxLength: 255 })
  description: string;

  // tags
  // Tags for the segment

  @StringField({ maxLength: 20, minLength: 3, nullable: false })
  projKey: string;

  // TODO: this should not be nullable
  // TODO: this should not be exposed through the GraphQL either
  // TODO: should create "ManyToOneByKey" to join tables by a non-ID key
  @ManyToOne(() => Project, (project: Project) => project.segments, {
    skipGraphQLField: true,
    nullable: true
  })
  project?: Project;

  @StringField({ maxLength: 20, minLength: 3, nullable: false })
  envKey: string;

  // TODO: this should not be nullable
  // TODO: this should not be exposed through the GraphQL either
  // TODO: should create "ManyToOneByKey" to join tables by a non-ID key
  @ManyToOne(() => Environment, (environment: Environment) => environment.segments, {
    nullable: true,
    skipGraphQLField: true
  })
  environment?: Environment;

  @OneToMany(
    () => FeatureFlagSegment,
    (featureFlagSegment: FeatureFlagSegment) => featureFlagSegment.segment
  )
  featureFlagSegments?: FeatureFlagSegment[];

  @OneToMany(() => UserSegment, (userSegments: UserSegment) => userSegments.segment)
  userSegments?: UserSegment[];
}
