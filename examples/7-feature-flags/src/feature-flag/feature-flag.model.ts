import { BaseModel, Model, StringField } from '../../../../src';

@Model()
export class FeatureFlag extends BaseModel {
  @StringField({ maxLength: 30 })
  firstName?: string;

  @StringField({ maxLength: 50, minLength: 2 })
  lastName?: string;

  // name*
  // A human-friendly name for the feature flag {

  // key*
  // A
  // } unique key that will be used to reference the flag in your code

  // NOTE: not doing variations

  // temporary
  // Whether or not the flag is a temporary flag

  // tags
  // Tags for the feature flag {

  // includeInSnippet
  // }
  // Whether or not this flag should be made available to the client-side JavaScript SDK

  // PATH PARAMS

  // projKey*
  // The project key
}
