import { InterfaceType as TypeGraphQLInterfaceType } from 'type-graphql';

import { Constructor } from '../core';
import { getMetadataStorage } from '../metadata';
import { ClassDecoratorFactory, composeClassDecorators } from '../utils/';

type InterfaceOptions = object; // TypeGraphQL InterfaceType's InterfaceOptions

export function InterfaceType(options: InterfaceOptions = {}) {
  // Need to set as "any" here as we're dealing with abstract classes that are not newable,
  // So we can't define this as "ClassType"
  const registerWithWarthog = (target: Constructor): void => {
    getMetadataStorage().addInterfaceType(target.name);
  };

  const factories = [
    TypeGraphQLInterfaceType(options) as ClassDecoratorFactory,
    registerWithWarthog as ClassDecoratorFactory
  ];

  return composeClassDecorators(...factories);
}
