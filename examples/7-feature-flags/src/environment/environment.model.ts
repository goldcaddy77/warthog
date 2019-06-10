// import { BaseModel, IDType, ManyToOne, Model, StringField } from '../../../../src';
import { BaseModel, Model, StringField } from '../../../../src';

// import { Project } from '../project/project.model';

@Model()
// TODO: Unique key+projectKey
export class Environment extends BaseModel {
  @StringField({ maxLength: 50, minLength: 3, nullable: false })
  name: string;

  @StringField({ maxLength: 20, minLength: 3, nullable: false, unique: true })
  key: string;

  // @StringField({ maxLength: 20, minLength: 3, nullable: false })
  // projectKey: IDType;

  // @ManyToOne(() => Project, (project: Project) => project.environments, { nullable: false })
  // project?: Project;

  // color
  // defaultTtl
}
