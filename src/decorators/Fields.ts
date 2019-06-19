import * as graphqlFields from 'graphql-fields';
import { createParamDecorator } from 'type-graphql';

export function Fields(): ParameterDecorator {
  return createParamDecorator(({ info }) => {
    return Object.keys(graphqlFields(info));
  });
}
