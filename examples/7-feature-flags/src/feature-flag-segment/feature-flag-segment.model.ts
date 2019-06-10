import { BaseModel, Model, StringField } from '../../../../src';

@Model()
export class FeatureFlagSegment extends BaseModel {
  @StringField({ maxLength: 30 })
  firstName?: string;

  // featureFlagId
  // segmentId
}
