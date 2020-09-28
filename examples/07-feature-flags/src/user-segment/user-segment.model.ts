import { BaseModel, ManyToOne, Model, StringField } from 'warthog';

// import {Environment, Project, Segment, User} from '../models'
import { Environment } from '../environment/environment.model';
import { Project } from '../project/project.model';
import { Segment } from '../segment/segment.model';
import { User } from '../user/user.model';

@Model()
export class UserSegment extends BaseModel {
  @StringField({ maxLength: 20, minLength: 3, nullable: false })
  projKey: string;

  @ManyToOne(
    () => Project,
    (project: Project) => project.userSegments,
    {
      nullable: true,
      skipGraphQLField: true
    }
  )
  project?: Project;

  @StringField({ maxLength: 20, minLength: 3, nullable: false })
  envKey: string;

  @ManyToOne(
    () => Environment,
    (environment: Environment) => environment.userSegments,
    {
      nullable: true,
      skipGraphQLField: true
    }
  )
  environment?: Environment;

  @StringField({ maxLength: 20, minLength: 3, nullable: false })
  userKey: string;

  @ManyToOne(
    () => User,
    (user: User) => user.userSegments,
    {
      nullable: true,
      skipGraphQLField: true
    }
  )
  user?: User;

  @StringField({ maxLength: 20, minLength: 3, nullable: false })
  segmentKey: string;

  @ManyToOne(
    () => Segment,
    (segment: Segment) => segment.userSegments,
    {
      nullable: true,
      skipGraphQLField: true
    }
  )
  segment?: Segment;
}
