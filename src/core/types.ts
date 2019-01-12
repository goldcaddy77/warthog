export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type StringMap = { [key: string]: string };

export type DateTime = string;
export type IDType = string;

export interface BaseEntity {
  id: IDType;
  [key: string]: any;
}

export type WhereInput = {
  id_eq?: IDType;
  id_in?: IDType[];
};

export type DeleteReponse = {
  id: IDType;
};

export interface ClassType<T = any> {
  new (...args: any[]): T;
}
