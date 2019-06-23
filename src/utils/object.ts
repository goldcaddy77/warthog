import { StringUtil } from './string';

export class ObjectUtil {
  // Ex: prefixKeys({one: 1}, 'PRE_') => {PRE_one: 1}
  static prefixKeys<T>(obj: { [key: string]: T }, prefix: string) {
    return Object.keys(obj).reduce((result: { [key: string]: T }, key: string) => {
      result[`${prefix}${key}`] = obj[key];
      return result;
    }, {});
  }

  // Ex: constantizeKeys({helloWorld: 1}) => {HELLO_WORLD: 1}
  static constantizeKeys<T>(obj: { [key: string]: T }): { [key: string]: T } {
    return Object.keys(obj).reduce((result: { [key: string]: T }, key: string) => {
      result[StringUtil.constantize(key)] = obj[key];
      return result;
    }, {});
  }
}
