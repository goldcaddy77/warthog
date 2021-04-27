import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseService } from '../../../../src';

import { Author } from './author.model';

@Service('AuthorService')
export class AuthorService extends BaseService<Author> {
  constructor(@InjectRepository(Author) protected readonly repository: Repository<Author>) {
    super(Author, repository);
  }
}
