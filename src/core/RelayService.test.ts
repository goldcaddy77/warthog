import { Container } from 'typedi';
import { Entity } from 'typeorm';

import { BaseModel, StringField } from '../';

import { RelayService } from './RelayService';

@Entity()
export class Foo extends BaseModel {
  @StringField()
  name?: string;
}

describe('RelayService', () => {
  let service: RelayService;
  let foo: Foo;
  let bar: Foo;

  beforeEach(() => {
    service = Container.get(RelayService);

    foo = new Foo();
    foo.name = 'Foo';
    foo.createdAt = new Date('1981-10-15');
  });

  describe('getCursorOrderBy', () => {
    test('defaults to ID', () => {
      expect(service.getCursorOrderBy()).toStrictEqual(['id_ASC']);
    });

    test('Adds ID to sort', () => {
      expect(service.getCursorOrderBy('foo_DESC')).toStrictEqual(['foo_DESC', 'id_ASC']);
    });

    test('Does not add ID to sort if already sorting by ID', () => {
      expect(service.getCursorOrderBy('id_ASC')).toStrictEqual(['id_ASC']);
      expect(service.getCursorOrderBy('id_DESC')).toStrictEqual(['id_DESC']);
    });
  });

  describe('getCursor', () => {
    test('Works with Dates', () => {
      expect(service.getCursor(foo, 'createdAt_ASC')).toBe(
        'createdAt_ASC:1981-10-15T00:00:00.000Z'
      );
    });

    test('Works with multiple sorts', () => {
      expect(service.getCursor(foo, ['createdAt_DESC', 'name_ASC'])).toBe(
        'createdAt_DESC:1981-10-15T00:00:00.000Z,name_ASC:Foo'
      );
    });
  });

  describe('getFirstAndLast', () => {
    test('throws if data has no items', () => {
      expect(() => {
        return service.getFirstAndLast([], 10);
      }).toThrow();
    });

    test('Returns the same for first and last if 1 item', () => {
      expect(service.getFirstAndLast([foo], 10)).toStrictEqual([foo, foo]);
    });

    test('Works for 2 items', () => {
      const bar = new Foo();
      bar.name = 'Bar';
      bar.createdAt = new Date('1981-10-15');

      expect(service.getFirstAndLast([foo, bar], 10)).toStrictEqual([foo, bar]);
    });

    test('Works for 3 items', () => {
      const bar = new Foo();
      bar.name = 'Bar';
      bar.createdAt = new Date('1981-10-15');

      const baz = new Foo();
      baz.name = 'Baz';
      baz.createdAt = new Date('1981-10-15');

      // Since we always ask for 1 more than we need, we chop off `baz` here
      expect(service.getFirstAndLast([foo, bar, baz], 2)).toStrictEqual([foo, bar]);
    });
  });

  describe('getPageInfo', () => {
    test('throws if data has no items', () => {
      expect(() => {
        return service.getPageInfo([], 'createdAt_ASC', 10, 0);
      }).toThrow();
    });

    test('Returns the same for first and last if 1 item', () => {
      expect(service.getPageInfo([foo], 'createdAt_ASC', 10, 0)).toEqual({
        endCursor: 'createdAt_ASC:1981-10-15T00:00:00.000Z',
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: 'createdAt_ASC:1981-10-15T00:00:00.000Z'
      });
    });
  });
});
