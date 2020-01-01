import { Connection } from 'typeorm';

// TODO-MVP: update with actual context we're getting from Auth0
export interface BaseContext {
  connection: Connection;
  dataLoader: {
    initialized: boolean;
    loaders: { [key: string]: { [key: string]: any } };
  };
  request: any;
  user?: any;
}
