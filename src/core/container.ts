import { Container } from 'typedi';
import { ClassType } from './';

export function getContainer<T extends ClassType>(container: T): InstanceType<T> {
  let result: InstanceType<T>;
  try {
    Container.import([container]);
    result = Container.get(container.name);
  } catch (error) {
    console.error(container, error);
    throw error;
  }

  return result;
}
