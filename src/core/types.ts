export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface StringMap {
  [key: string]: string;
}
export interface StringMapOptional {
  [key: string]: string | undefined;
}

export type DateOnlyString = string;
export type DateTimeString = string;
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

export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export type JsonPrimitive = string | number | boolean | null;

export type JsonObject = { [member: string]: JsonValue };

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface JsonArray extends Array<JsonValue> {}
