import { plainToClass } from 'class-transformer';
import { ClassType } from '../core';

export function createEntity<T>(entityType: ClassType<T>, data: Partial<T>): T {
  return plainToClass<T, Partial<T>>(entityType, data);
}
