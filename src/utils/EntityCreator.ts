import { plainToClass } from 'class-transformer';

export declare type ClassType<T> = {
  new (...args: any[]): T;
};

export function createEntity<T>(entityType: ClassType<T>, data: Partial<T>): T {
  return plainToClass<T, Partial<T>>(entityType, data);
}
