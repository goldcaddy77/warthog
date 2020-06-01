import { Service } from 'typedi';

@Service()
export class EncodingService {
  JSON_MARKER = '__JSON__:';

  encode64(str: string): string {
    return Buffer.from(str, 'ascii').toString('base64');
  }

  encode(input: object): string {
    return this.encode64(JSON.stringify(input));
  }

  decode64(str: string): string {
    return Buffer.from(str, 'base64').toString('ascii');
  }

  decode<T>(str: string): T {
    return JSON.parse(this.decode64(str));
  }
}
