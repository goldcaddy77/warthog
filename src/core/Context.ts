import { Request } from 'express'; // tslint:disable-line
import { Connection } from 'typeorm';

// TODO-MVP: update with actual context we're getting from Auth0
export interface Context {
  connection: Connection;
  request: Request;
  user: {
    email: string;
    id: string;
    permissions: string[];
  };
  dataLoader: {
    initialized: boolean;
    loaders: { [key: string]: { [key: string]: any } };
  };
}
