// https://docs.pokemontcg.io/#documentationheaders

import { RESTDataSource } from './RESTDataSource';
import { WhereInput, StringMap } from '../../../src/core/';

export class RestService<E> extends RESTDataSource {
  columnMap: StringMap;
  klass: string;

  //   constructor(protected entityClass: any) {
  constructor() {
    super();
    this.baseURL = 'https://api.pokemontcg.io/v1/';
  }

  async find<W extends WhereInput>(
    where?: any,
    orderBy?: string,
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<E[]> {
    const data = await this.get('cards', {
      per_page: limit
    });
    return data.results;
  }

  // If the unique input has only 1 item, it should be requied
  async findOne<W extends { id?: string }>(where: Partial<W>): Promise<E> {
    return this.get(`cards/${where.id}`);
  }
}

// https://api.pokemontcg.io/v1/cards

// /cards/:id

// This call will return a maximum of 1000 cards. The default is 100.

// Example:name=blastoise|charizard

// More examples: types=fire,metal versus colors=fire|metal

// Headers

// Link: Link headers with prev, last, next, first links (when appropriate)
// Page-Size: The page size for the request
// Count: The number of elements returned
// Total-Count: The total number of elements (across all pages)
// Ratelimit-Limit: The ratelimit for a given user
// Ratelimit-Remaining: The number of requests left before the ratelimit is exceeded.

// // CLI - need array type

// yarn warthog generate card name! nationalPokedexNumber:int types subtype supertype hp number artist rarity series set setCode retreatCost convertedRetreatCost text attackDamage attackCost attackName attackText weaknesses resistances ancientTrait abilityName abilityText abilityType evolvesFrom contains imageUrl imageUrlHiRes ability attacks

// // Fields - all filterable except

// imageUrl
// imageUrlHiRes
// ability
// attacks
