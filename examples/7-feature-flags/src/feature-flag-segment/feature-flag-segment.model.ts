import { BaseModel, ManyToOne, Model, StringField } from '../../../../src';

import { Environment } from '../environment/environment.model';
import { FeatureFlag } from '../feature-flag/feature-flag.model';
import { Project } from '../project/project.model';
import { Segment } from '../segment/segment.model';

@Model()
export class FeatureFlagSegment extends BaseModel {
  @StringField({ maxLength: 20, minLength: 3, nullable: false })
  projKey: string;

  @ManyToOne(() => Project, (project: Project) => project.featureFlagSegments, {
    nullable: true,
    skipGraphQLField: true
  })
  project?: Project;

  @StringField({ maxLength: 20, minLength: 3, nullable: false })
  envKey: string;

  @ManyToOne(() => Environment, (environment: Environment) => environment.featureFlagSegments, {
    nullable: true,
    skipGraphQLField: true
  })
  environment?: Environment;

  @StringField({ maxLength: 20, minLength: 3, nullable: false })
  featureKey: string;

  @ManyToOne(() => FeatureFlag, (featureFlag: FeatureFlag) => featureFlag.featureFlagSegments, {
    nullable: true,
    skipGraphQLField: true
  })
  featureFlag?: FeatureFlag;

  @StringField({ maxLength: 20, minLength: 3, nullable: false })
  segmentKey: string;

  @ManyToOne(() => Segment, (segment: Segment) => segment.featureFlagSegments, {
    nullable: true,
    skipGraphQLField: true
  })
  segment?: Segment;
}
