import { Constructor } from '../core';

export type MethodDecoratorFactory = (
  target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => any;

export function composeMethodDecorators(...factories: MethodDecoratorFactory[]) {
  return (target: object, propertyKey: string, descriptor: PropertyDescriptor): any => {
    factories.forEach(factory => factory(target, propertyKey, descriptor));
  };
}

export type ClassDecoratorFactory = (target: Constructor) => any;

export function composeClassDecorators(...factories: ClassDecoratorFactory[]) {
  return (target: Constructor): any => {
    // Do NOT return anything here or it will take over the class it's decorating
    // See: https://www.typescriptlang.org/docs/handbook/decorators.html
    factories.forEach(factory => {
      return factory(target);
    });
  };
}
