import { Request } from 'express';
import { Connection } from 'typeorm';

export interface BaseContext {
  connection: Connection;
  dataLoader: {
    initialized: boolean;
    loaders: { [key: string]: { [key: string]: any } };
  };
  request: Request;
  user?: any;
}
