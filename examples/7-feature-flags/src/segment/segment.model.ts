import { BaseModel, ManyToOne, Model, StringField } from '../../../../src';

import { Environment } from '../environment/environment.model';
import { Project } from '../project/project.model';

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
  @ManyToOne(() => Project, (project: Project) => project.segments, { skipGraphQLField: true, nullable: true })
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
}