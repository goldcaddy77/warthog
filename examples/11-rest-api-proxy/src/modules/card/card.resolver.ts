import { Arg, Args, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { Fields } from '../../../../../src';

import { CardWhereArgs, CardWhereInput, CardWhereUniqueInput } from '../../../generated';

import { Card } from './card.model';
import { CardService } from './card.service';

@Resolver(Card)
export class CardResolver {
  constructor(@Inject('CardService') public readonly service: CardService) {}

  @Query(() => [Card])
  async cards(
    @Args() { where, orderBy, limit, offset }: CardWhereArgs,
    @Fields() fields: string[]
  ): Promise<Card[]> {
    return this.service.find<CardWhereInput>(where, orderBy, limit, offset, fields);
  }

  @Query(() => Card)
  async card(@Arg('where') where: CardWhereUniqueInput): Promise<Card> {
    return this.service.findOne<CardWhereUniqueInput>(where);
  }
}
