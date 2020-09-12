import { Container } from 'typedi';
import { Entity } from 'typeorm';

import { BaseModel, StringField } from '../';

import { EncodingService } from './encoding';
import { RelayService, SortDirection } from './RelayService';

@Entity()
export class Foo extends BaseModel {
  @StringField()
  name?: string;
}

describe('RelayService', () => {
  const relay = Container.get(RelayService);
  const e = Container.get(EncodingService);
  const sortIdASC = { column: 'id', direction: 'ASC' as SortDirection };
  const sortIdDESC = { column: 'id', direction: 'DESC' as SortDirection };
  const sortCreatedAtASC = { column: 'createdAt', direction: 'ASC' as SortDirection };
  const sortCreatedAtDESC = { column: 'createdAt', direction: 'DESC' as SortDirection };
  const sortFooDESC = { column: 'foo', direction: 'DESC' as SortDirection };

  const foo = new Foo();
  foo.id = '1';
  foo.name = 'Foo';
  foo.createdAt = new Date('1981-10-15');

  const bar = new Foo();
  bar.id = '2';
  bar.name = 'Bar';
  bar.createdAt = new Date('1989-11-20');

  describe('toSortArray', () => {
    test('defaults to empty array', () => {
      expect(relay.toSortArray()).toEqual([]);
    });

    test('turns a sort into a Sort array', () => {
      expect(relay.toSortArray(sortIdASC)).toStrictEqual([sortIdASC]);
    });

    test('works with ID sort DESC', () => {
      expect(relay.toSortArray('id_DESC')).toEqual([sortIdDESC]);
    });

    test('works with non-ID sorts', () => {
      expect(relay.toSortArray('createdAt_ASC')).toEqual([sortCreatedAtASC]);
    });

    test('works with an array input including ID', () => {
      expect(relay.toSortArray(['createdAt_ASC', 'id_DESC'])).toEqual([
        sortCreatedAtASC,
        sortIdDESC
      ]);
    });

    test('works with an array input not including ID', () => {
      expect(relay.toSortArray(['createdAt_ASC', 'foo_DESC'])).toEqual([
        sortCreatedAtASC,
        sortFooDESC
      ]);
    });
  });

  describe('normalizeSort', () => {
    test('defaults to ID', () => {
      expect(relay.normalizeSort()).toStrictEqual([sortIdASC]);
    });

    test('Adds ID to sort', () => {
      expect(relay.normalizeSort(sortFooDESC)).toEqual([sortFooDESC, sortIdASC]);
    });

    test('Does not add ID to sort if already sorting by ID', () => {
      expect(relay.normalizeSort(sortIdASC)).toStrictEqual([sortIdASC]);
      expect(relay.normalizeSort(sortIdDESC)).toStrictEqual([sortIdDESC]);
    });
  });

  describe('encodeCursorItem', () => {
    test('Works with Dates', () => {
      expect(relay.encodeCursor(foo, sortCreatedAtDESC)).toBe(
        e.encode(['1981-10-15T00:00:00.000Z', '1'])
      );
    });
  });

  describe('encodeCursor', () => {
    test('Works with multiple sorts', () => {
      const sortNameASC = { column: 'name', direction: 'ASC' as SortDirection };

      expect(relay.encodeCursor(foo, [sortCreatedAtDESC, sortNameASC])).toBe(
        e.encode(['1981-10-15T00:00:00.000Z', 'Foo', '1'])
      );
    });
  });

  describe('decodeCursor', () => {
    test('Works with multiple sorts', () => {
      const obj = relay.decodeCursor(
        'W1siY3JlYXRlZEF0IiwiREVTQyIsIjE5ODEtMTAtMTVUMDA6MDA6MDAuMDAwWiJdLFsibmFtZSIsIkFTQyIsIkZvbyJdLFsiaWQiLCJBU0MiLCIxIl1d'
      );

      expect(obj).toStrictEqual([
        ['createdAt', 'DESC', '1981-10-15T00:00:00.000Z'],
        ['name', 'ASC', 'Foo'],
        ['id', 'ASC', '1']
      ]);
    });
  });

  describe('getFirstAndLast', () => {
    test('throws if data has no items', () => {
      expect(() => {
        return relay.firstAndLast([], 10);
      }).toThrow();
    });

    test('Returns the same for first and last if 1 item', () => {
      expect(relay.firstAndLast([foo], 10)).toStrictEqual([foo, foo]);
    });

    test('Works for 2 items', () => {
      expect(relay.firstAndLast([foo, bar], 10)).toStrictEqual([foo, bar]);
    });

    test('Works for 3 items', () => {
      const baz = new Foo();
      baz.name = 'Baz';
      baz.createdAt = new Date('1981-10-15');

      // Since we always ask for 1 more than we need, `baz` gets chopped off here
      expect(relay.firstAndLast([foo, bar, baz], 2)).toStrictEqual([foo, bar]);
    });
  });

  describe('getPageInfo', () => {
    test('throws if data has no items', () => {
      expect(() => {
        return relay.getPageInfo([], sortCreatedAtASC, { first: 1 });
      }).toThrow();
    });

    test('Returns the same for first and last if 1 item', () => {
      const result = relay.getPageInfo([foo], sortCreatedAtASC, { first: 1 });
      const startDecoded = e.decode(result.startCursor);
      const endDecoded = e.decode(result.endCursor);

      expect(result.hasNextPage).toEqual(false);
      expect(result.hasPreviousPage).toEqual(false);
      expect(startDecoded).toEqual(['1981-10-15T00:00:00.000Z', '1']);
      expect(endDecoded).toEqual(['1981-10-15T00:00:00.000Z', '1']);
    });

    test('Works properly if youre on the last page', () => {
      const result = relay.getPageInfo([foo, foo, foo, foo, bar, foo], sortCreatedAtASC, {
        first: 5
      });
      const startDecoded = e.decode(result.startCursor);
      const endDecoded = e.decode(result.endCursor);

      expect(result.hasNextPage).toEqual(true);
      expect(result.hasPreviousPage).toEqual(false);
      expect(startDecoded).toEqual(['1981-10-15T00:00:00.000Z', '1']);
      expect(endDecoded).toEqual(['1989-11-20T00:00:00.000Z', '2']);
    });

    // TODO: Add tests for last/before
  });

  describe('effectiveOrder', () => {
    test('works with no sorts and first', () => {
      expect(relay.effectiveOrder(undefined, { first: 10 })).toEqual([sortIdASC]);
    });

    test('works with multiple sorts and first', () => {
      expect(relay.effectiveOrder('foo_DESC', { first: 10 })).toEqual([sortFooDESC, sortIdASC]);
    });

    test('works with no sorts and last (reversed)', () => {
      expect(relay.effectiveOrder(undefined, { last: 10 })).toEqual([sortIdDESC]);
    });

    test('works with multiple sorts and last (reversed)', () => {
      expect(relay.effectiveOrder('foo_ASC', { last: 10 })).toEqual([sortFooDESC, sortIdDESC]);
    });
  });

  describe('getFilters', () => {
    test('returns empty object if there is no cursor', () => {
      expect(relay.getFilters(undefined, { first: 1 })).toEqual({});
    });

    test('works for base ID case', () => {
      const cursor = relay.encodeCursor(foo, 'id_ASC');
      expect(relay.getFilters(undefined, { first: 1, after: cursor })).toEqual({
        OR: [{ id_gt: '1' }]
      });
    });

    test('works with non-id sort', () => {
      const sorts = 'name_DESC';
      const cursor = relay.encodeCursor(foo, sorts);
      expect(relay.getFilters(sorts, { first: 1, after: cursor })).toEqual({
        OR: [{ name_lt: 'Foo' }, { id_gt: '1', name_eq: 'Foo' }]
      });
    });

    test('works several sorts', () => {
      const sorts = ['createdAt_ASC', 'name_DESC', 'id_ASC'];
      const cursor = relay.encodeCursor(foo, sorts);
      expect(relay.getFilters(sorts, { first: 1, after: cursor })).toEqual({
        OR: [
          { createdAt_gt: '1981-10-15T00:00:00.000Z' },
          { createdAt_eq: '1981-10-15T00:00:00.000Z', name_lt: 'Foo' },
          { createdAt_eq: '1981-10-15T00:00:00.000Z', name_eq: 'Foo', id_gt: '1' }
        ]
      });
    });
  });
});
