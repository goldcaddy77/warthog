import { Service } from 'typedi';
import { ApiOnly } from './api-only.model';

// The API only model does not connect to the DB, so you'll need to customize the methods used in the resolver
@Service('ApiOnlyService')
export class ApiOnlyService {
  constructor() {
    //
  }

  find<T>(where?: any, orderBy?: string, limit?: number, offset?: number, fields?: string[]) {
    console.log(where, orderBy, limit, offset, fields);
    return [] as ApiOnly[];
  }
}
