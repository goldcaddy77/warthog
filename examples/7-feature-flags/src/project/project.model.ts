import { BaseModel, Model, OneToMany, StringField } from '../../../../src';

// import { Environment } from '../environment/environment.model';

@Model()
export class Project extends BaseModel {
  @StringField({ maxLength: 50, minLength: 3, nullable: false })
  name: string;

  @StringField({ maxLength: 20, minLength: 3, nullable: false, unique: true })
  key: string;

  // @OneToMany(() => Environment, (environment: Environment) => environment.project)
  // environments?: Environment[];
}
