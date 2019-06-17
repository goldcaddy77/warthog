const graphqlFields = require('graphql-fields'); // tslint:disable-line
import { createParamDecorator } from 'type-graphql';

export function Fields(): ParameterDecorator {
  return createParamDecorator(({ info }) => {
    return Object.keys(graphqlFields(info));
  });
}
