// import { Query } from 'type-graphql';
import { ReturnTypeFunc } from 'type-graphql/dist/decorators/types';

import { getMetadataStorage } from '../metadata';

export function FindOneQuery(returnTypeFunc: ReturnTypeFunc): any {
  //   @Query(modelGetter)

  return (target: object, propertyKey: string): any => {
    getMetadataStorage().addEndpont(
      'findOne',
      returnTypeFunc,
      target.constructor.name,
      propertyKey
    );
  };
}
