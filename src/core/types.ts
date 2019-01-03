export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type StringMap = { [key: string]: string };

export type DateTime = string;
export type ID = string;

export interface BaseEntity {
  id: ID;
  [key: string]: any;
}

export type WhereInput = {
  id_eq?: ID;
  id_in?: ID[];
};

export type DeleteReponse = {
  id: ID;
};
