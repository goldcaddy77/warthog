import { ClassType } from '../core'
import { composeMethodDecorators, composeClassDecorators } from './decoratorComposer'

const classDecoratorMock = jest.fn()
const methodDecoratorMock = jest.fn()

function ComposedClassDecorator() {
  const classDecoratorOne = function classDecoratorOne(target: ClassType): void {
    classDecoratorMock(target, 'classDecoratorOne')
  }

  const classDecoratorTwo = function classDecoratorTwo(target: ClassType): void {
    classDecoratorMock(target, 'classDecoratorTwo')
  }

  const factories = [classDecoratorOne, classDecoratorTwo]
  return composeClassDecorators(...factories)
}

function ComposedMethodDecorator() {
  const methodDecoratorOne = (
    target: object, // TODO: why can't this be ClassType?
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { value, get, set, ...descriptorScalarParts } = descriptor
    methodDecoratorMock(
      'methodDecoratorOne',
      target.constructor.name,
      propertyKey,
      descriptorScalarParts,
      typeof value
    )
  }

  const methodDecoratorTwo = (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { value, get, set, ...descriptorScalarParts } = descriptor
    methodDecoratorMock(
      'methodDecoratorTwo',
      target.constructor.name,
      propertyKey,
      descriptorScalarParts,
      typeof value
    )
  }

  const factories = [methodDecoratorOne, methodDecoratorTwo]
  return composeMethodDecorators(...factories)
}

@ComposedClassDecorator()
// @ts-ignore : TODO: shouldn't need this here.  Need to teach vscode how to allow experimental decorators in test files
class TestClass {
  constructor() {}

  @ComposedMethodDecorator()
  // @ts-ignore : TODO: shouldn't need this here
  public TestMethod() {}
}

describe('composeMethodDecorators', () => {
  test('calls all decorators properly', async () => {
    new TestClass()
    expect(classDecoratorMock).toHaveBeenCalledTimes(2)
    expect(classDecoratorMock).toHaveBeenNthCalledWith(1, TestClass, 'classDecoratorOne')
    expect(classDecoratorMock).toHaveBeenNthCalledWith(2, TestClass, 'classDecoratorTwo')
  })
})

describe('composeClassDecorators', () => {
  test('calls all decorators properly', async () => {
    new TestClass()
    const expectedDescriptors = { configurable: true, enumerable: true, writable: true }
    expect(methodDecoratorMock).toHaveBeenCalledTimes(2)
    expect(methodDecoratorMock).toHaveBeenNthCalledWith(
      1,
      'methodDecoratorOne',
      'TestClass',
      'TestMethod',
      expectedDescriptors,
      'function'
    )
    expect(methodDecoratorMock).toHaveBeenNthCalledWith(
      2,
      'methodDecoratorTwo',
      'TestClass',
      'TestMethod',
      expectedDescriptors,
      'function'
    )
  })
})
