import { Container } from 'typedi';
import { Entity } from 'typeorm';

import { BaseModel, StringField } from '../';

import { EncodingService } from './encoding';
import { RelayService } from './RelayService';

@Entity()
export class Foo extends BaseModel {
  @StringField()
  name?: string;
}

describe('RelayService', () => {
  const relay = Container.get(RelayService);
  const e = Container.get(EncodingService);

  const foo = new Foo();
  foo.id = '1';
  foo.name = 'Foo';
  foo.createdAt = new Date('1981-10-15');

  const bar = new Foo();
  bar.id = '2';
  bar.name = 'Bar';
  bar.createdAt = new Date('1989-11-20');

  describe('toSortArray', () => {
    test.only('turns a sort into a Sort array', () => {
      expect(relay.toSortArray(['id', 'ASC'])).toStrictEqual([['id', 'ASC']]);
    });
  });

  describe('normalizeSort', () => {
    test('defaults to ID', () => {
      expect(relay.normalizeSort()).toStrictEqual([['id', 'ASC']]);
    });

    test('Adds ID to sort', () => {
      console.log(relay.normalizeSort(['foo', 'DESC']));
      expect(relay.normalizeSort(['foo', 'DESC'])).toEqual([
        ['foo', 'DESC'],
        ['id', 'ASC']
      ]);
    });

    test('Does not add ID to sort if already sorting by ID', () => {
      expect(relay.normalizeSort(['id', 'ASC'])).toStrictEqual([['id', 'ASC']]);
      expect(relay.normalizeSort(['id', 'DESC'])).toStrictEqual(['id_DESC']);
    });
  });

  describe('encodeCursorItem', () => {
    test('Works with Dates', () => {
      expect(relay.encodeCursor(foo, ['createdAt', 'DESC'])).toBe(
        e.encode([['createdAt_DESC', '1981-10-15T00:00:00.000Z']])
      );
    });
  });

  describe('encodeCursor', () => {
    test('Works with multiple sorts', () => {
      const expected = e.encode([
        ['createdAt_DESC', '1981-10-15T00:00:00.000Z'],
        ['name_ASC', 'Foo']
      ]);
      expect(
        relay.encodeCursor(foo, [
          ['createdAt', 'DESC'],
          ['name', 'ASC']
        ])
      ).toBe(expected);
    });
  });

  describe('decodeCursor', () => {
    test('Works with multiple sorts', () => {
      const obj = relay.decodeCursor(
        'W1siY3JlYXRlZEF0X0RFU0MiLCIxOTgxLTEwLTE1VDAwOjAwOjAwLjAwMFoiXSxbIm5hbWVfQVNDIiwiRm9vIl1d'
      );

      expect(obj).toStrictEqual([
        { direction: 'DESC', field: 'createdAt', value: '1981-10-15T00:00:00.000Z' },
        { direction: 'ASC', field: 'name', value: 'Foo' }
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
        return relay.getPageInfo([], ['createdAt', 'ASC'], { first: 1 });
      }).toThrow();
    });

    test('Returns the same for first and last if 1 item', () => {
      const result = relay.getPageInfo([foo], ['createdAt', 'ASC'], { first: 1 });
      const startDecoded = e.decode(result.startCursor);
      const endDecoded = e.decode(result.endCursor);

      expect(result.hasNextPage).toEqual(false);
      expect(result.hasPreviousPage).toEqual(false);
      expect(startDecoded).toEqual([
        ['createdAt_ASC', '1981-10-15T00:00:00.000Z'],
        ['id_ASC', '1']
      ]);
      expect(endDecoded).toEqual([
        ['createdAt_ASC', '1981-10-15T00:00:00.000Z'],
        ['id_ASC', '1']
      ]);
    });

    test('Works properly if youre on the last page', () => {
      const result = relay.getPageInfo([foo, foo, foo, foo, bar, foo], ['createdAt', 'ASC'], {
        first: 5
      });
      const startDecoded = e.decode(result.startCursor);
      const endDecoded = e.decode(result.endCursor);

      expect(result.hasNextPage).toEqual(true);
      expect(result.hasPreviousPage).toEqual(false);
      expect(startDecoded).toEqual([
        ['createdAt_ASC', '1981-10-15T00:00:00.000Z'],
        ['id_ASC', '1']
      ]);
      expect(endDecoded).toEqual([
        ['createdAt_ASC', '1989-11-20T00:00:00.000Z'],
        ['id_ASC', '2']
      ]);
    });

    // TODO: Add tests for last/before
  });

  describe('getPageInfo', () => {});
});
