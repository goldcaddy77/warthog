import { BaseModel, Model, StringField } from '../../../../src';

@Model()
export class Segment extends BaseModel {
  // ########################### Segment

  // ######### Keys

  // projKey*
  // The project key

  // envKey*
  // The environment key

  // ######### Data

  // name*
  // A human-friendly name for the segment

  // key*
  // A unique key that will be used to reference the segment

  // description
  // A description of the segment's purpose

  // tags
  // Tags for the segment

  // PATH PARAMS

  @StringField({ maxLength: 30 })
  firstName?: string;

  @StringField({ maxLength: 50, minLength: 2 })
  lastName?: string;
}
