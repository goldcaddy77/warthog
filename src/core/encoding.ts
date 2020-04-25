import { Service } from 'typedi';

@Service()
export class EncodingService {
  encode(str: string): string {
    return Buffer.from(str, 'ascii').toString('base64');
  }

  decode(str: string): string {
    return Buffer.from(str, 'base64').toString('ascii');
  }
}
