import { Args, Query, Resolver } from '@nestjs/graphql';
import { Authorized } from 'type-graphql';
import { Inject } from 'typedi';

import { Fields } from '../../..';
import { ApiOnlyWhereArgs } from '../../generated';

import { ApiOnly } from './api-only.model';
import { ApiOnlyService } from './api-only.service';

@Resolver(ApiOnly)
export class DishResolver {
  constructor(@Inject('ApiOnlyService') public readonly service: ApiOnlyService) {}

  @Authorized('dish:read')
  @Query(() => [ApiOnly])
  async dishes(
    @Args() { where, orderBy, limit, offset }: ApiOnlyWhereArgs,
    @Fields() fields: string[]
  ): Promise<ApiOnly[]> {
    return this.service.find(where, orderBy, limit, offset, fields);
  }
}
