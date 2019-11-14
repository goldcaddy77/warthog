export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface StringMap {
  [key: string]: string;
}
export interface StringMapOptional {
  [key: string]: string | undefined;
}

export type DateTime = string;
export type IDType = string;

export interface BaseEntity {
  id: IDType;
  [key: string]: any;
}

export interface WhereInput {
  id_eq?: IDType;
  id_in?: IDType[];
}

export interface DeleteReponse {
  id: IDType;
}

export type ClassType<T = any> = new (...args: any[]) => T;

export type Constructor<T = any> = Function & { prototype: T };

export type Maybe<T> = T | void;
