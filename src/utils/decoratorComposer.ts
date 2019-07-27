import { ClassType } from '../core';

export type MethodDecoratorFactory = (
  target: object, // TODO: why can't this be ClassType?
  propertyKey: string,
  descriptor: PropertyDescriptor
) => any;

export function composeMethodDecorators(...factories: MethodDecoratorFactory[]) {
  return (target: object, propertyKey: string, descriptor: PropertyDescriptor): any => {
    factories.forEach(factory => factory(target, propertyKey, descriptor));
  };
}

export type ClassDecoratorFactory = (target: ClassType) => any;

export function composeClassDecorators(...factories: ClassDecoratorFactory[]) {
  return (target: ClassType): any => {
    // Do NOT return anything here or it will take over the class it's decorating
    // See: https://www.typescriptlang.org/docs/handbook/decorators.html
    factories.forEach(factory => {
      return factory(target);
    });
  };
}
