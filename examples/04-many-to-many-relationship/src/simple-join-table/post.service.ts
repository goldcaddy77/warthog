import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseService } from '../../../../src';

import { Post } from './post.model';

@Service('PostService')
export class PostService extends BaseService<Post> {
  constructor(@InjectRepository(Post) protected readonly repository: Repository<Post>) {
    super(Post, repository);
  }
}
