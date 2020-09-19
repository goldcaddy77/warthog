// import { Query } from 'type-graphql';
import { ReturnTypeFunc } from 'type-graphql/dist/decorators/types';

import { getMetadataStorage } from '../metadata';

export function ConnectionQuery(returnTypeFunc: ReturnTypeFunc): any {
  //   @Query(modelGetter)

  return (target: object, propertyKey: string): any => {
    getMetadataStorage().addEndpont(
      'connection',
      returnTypeFunc,
      target.constructor.name,
      propertyKey
    );
  };
}
