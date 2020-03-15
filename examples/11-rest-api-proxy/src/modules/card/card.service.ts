import { Service } from 'typedi';
import { RestService } from '../../rest.service';

// import { Card } from './card.model';

@Service('CardService')
export class CardService {
  // service: RestService;
  service: any;

  constructor() {
    this.service = new RestService();
  }

  find<W>(...args: any) {
    return this.service.find(...args);
  }

  findOne<W>(where: any) {
    return this.service.findOne(where);
  }
}
