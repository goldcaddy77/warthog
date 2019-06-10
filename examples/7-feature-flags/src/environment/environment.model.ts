import { BaseModel, ManyToOne, Model, OneToMany, StringField } from '../../../../src';

import { Project } from '../project/project.model';
import { Segment } from '../segment/segment.model';

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
}
