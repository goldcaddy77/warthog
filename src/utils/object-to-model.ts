import { plainToClass } from 'class-transformer';
import { ClassType } from '../core';

export function objectToModel<T>(modelType: ClassType<T>, data: Partial<T>): T {
  return plainToClass<T, Partial<T>>(modelType, data);
}
