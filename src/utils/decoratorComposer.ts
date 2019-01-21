export type MethodDecoratorFactory = (
  target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => any;

export function composeMethodDecorators(...factories: MethodDecoratorFactory[]) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): any => {
    // Reverse so that decorators are called in the order laid out at:
    // https://www.typescriptlang.org/docs/handbook/decorators.html
    factories.reverse().forEach(factory => factory(target, propertyKey, descriptor));
  };
}

export type ClassDecoratorFactory = (target: object) => any;

export function composeClassDecorators(...factories: ClassDecoratorFactory[]) {
  return (target: any): any => {
    // Do NOT return anything here or it will take over the class it's decorating
    // See: https://www.typescriptlang.org/docs/handbook/decorators.html
    factories.forEach(factory => {
      return factory(target);
    });
  };
}
