// Good test example: https://github.com/typeorm/typeorm/blob/master/test/functional/query-builder/brackets/query-builder-brackets.ts
import 'reflect-metadata';
import { Brackets, Connection } from 'typeorm';
import { Container } from 'typedi';

import { createDBConnection } from '../torm';

import { MyBase, MyBaseService } from './tests/entity/MyBase.model';

describe('BaseService', () => {
  let connection: Connection;
  let service: MyBaseService;
  beforeAll(async () => {
    connection = await createDBConnection({
      entities: [__dirname + '/tests/entity/*{.js,.ts}']
      // logging: 'all'
    });

    service = Container.get('MyBaseService');
  });
  beforeEach(async () => {
    await connection.synchronize(true);
  });
  afterAll(() => connection.close());

  test('buildFindQuery', async () => {
    await service.createMany(
      [
        { firstName: 'AA', lastName: '01' },
        { firstName: 'BB', lastName: '02' },
        { firstName: 'CC', lastName: '03' },
        { firstName: 'DD', lastName: '04' },
        { firstName: 'EE', lastName: '05' },
        { firstName: 'FF', lastName: '06' },
        { firstName: 'GG', lastName: '07' },
        { firstName: 'HH', lastName: '08' },
        { firstName: 'II', lastName: '09' },
        { firstName: 'JJ', lastName: '10' },
        { firstName: 'KK', lastName: '11' },
        { firstName: 'LL', lastName: '12' },
        { firstName: 'MM', lastName: '13' },
        { firstName: 'NN', lastName: '14' }
      ],
      '1'
    );

    const results = await service
      .buildFindQuery({
        OR: [
          { firstName_contains: 'A' },
          { firstName_contains: 'B' },
          { firstName_contains: 'C' },
          { firstName_contains: 'D' },
          { firstName_contains: 'J' },
          { firstName_contains: 'K' }
        ],
        AND: [{ lastName_contains: '0' }]
      } as any)
      .getMany();

    expect(results.length).toEqual(5);
  });

  describe('findConnection', () => {
    test('returns all objects with no inputs', async () => {
      await service.createMany(
        [
          { firstName: 'AA', lastName: '01' },
          { firstName: 'BB', lastName: '02' },
          { firstName: 'CC', lastName: '03' }
        ],
        '1'
      );

      const results = await service.findConnection();

      expect(results.edges?.length).toEqual(3);
    });

    test('returns a limited number of items if asked', async () => {
      await service.createMany(
        [
          { firstName: 'AA', lastName: '01' },
          { firstName: 'BB', lastName: '02' },
          { firstName: 'CC', lastName: '03' }
        ],
        '1'
      );

      const results = await service.findConnection(
        undefined,
        'firstName_ASC',
        { first: 2 },
        { edges: { node: { firstName: true } } }
      );

      expect(results.edges?.map(edge => edge.node?.firstName)).toEqual(['AA', 'BB']);
    });

    test('returns a limited number of items (using last)', async () => {
      await service.createMany(
        [
          { firstName: 'AA', lastName: '01' },
          { firstName: 'BB', lastName: '02' },
          { firstName: 'CC', lastName: '03' }
        ],
        '1'
      );

      const results = await service.findConnection(
        undefined,
        'firstName_ASC',
        { last: 2 },
        { edges: { node: { firstName: true } } }
      );

      expect(results.edges?.map(edge => edge.node?.firstName)).toEqual(['CC', 'BB']);
    });

    test('query with first, grab cursor and refetch', async () => {
      await service.createMany(
        [
          { firstName: 'AA', lastName: '01' },
          { firstName: 'BB', lastName: '02' },
          { firstName: 'CC', lastName: '03' },
          { firstName: 'DD', lastName: '04' },
          { firstName: 'EE', lastName: '05' },
          { firstName: 'FF', lastName: '06' },
          { firstName: 'GG', lastName: '07' }
        ],
        '1'
      );

      let results = await service.findConnection(
        undefined,
        'firstName_ASC',
        { first: 3 },
        {
          edges: { node: { firstName: true } },
          pageInfo: { endCursor: {}, hasNextPage: {}, hasPreviousPage: {} }
        }
      );

      expect(results.edges?.map(edge => edge.node?.firstName)).toEqual(['AA', 'BB', 'CC']);

      const cursor = results.pageInfo?.endCursor;

      results = await service.findConnection(
        undefined,
        'firstName_ASC',
        { first: 3, after: cursor },
        {
          edges: { node: { firstName: true } },
          pageInfo: { endCursor: {}, hasNextPage: {}, hasPreviousPage: {} }
        }
      );

      expect(results.edges?.map(edge => edge.node?.firstName)).toEqual(['DD', 'EE', 'FF']);
    });

    test('query with last, grab cursor and refetch', async () => {
      await service.createMany(
        [
          { firstName: 'AA', lastName: '01' },
          { firstName: 'BB', lastName: '02' },
          { firstName: 'CC', lastName: '03' },
          { firstName: 'DD', lastName: '04' },
          { firstName: 'EE', lastName: '05' },
          { firstName: 'FF', lastName: '06' },
          { firstName: 'GG', lastName: '07' }
        ],
        '1'
      );

      let results = await service.findConnection(
        undefined,
        'firstName_ASC',
        { last: 3 },
        {
          edges: { node: { firstName: true } },
          pageInfo: { endCursor: {}, hasNextPage: {}, hasPreviousPage: {} }
        }
      );

      expect(results.edges?.map(edge => edge.node?.firstName)).toEqual(['GG', 'FF', 'EE']);

      const cursor = results.pageInfo?.endCursor;

      results = await service.findConnection(
        undefined,
        'firstName_ASC',
        { last: 3, before: cursor },
        {
          edges: { node: { firstName: true } },
          pageInfo: { endCursor: {}, hasNextPage: {}, hasPreviousPage: {} }
        }
      );

      expect(results.edges?.map(edge => edge.node?.firstName)).toEqual(['DD', 'CC', 'BB']);
    });
  });

  test('multiple sorts, query with first, grab cursor and refetch', async () => {
    await service.createMany(
      [
        { registered: true, firstName: 'AA', lastName: '01' },
        { registered: false, firstName: 'BB', lastName: '02' },
        { registered: true, firstName: 'CC', lastName: '03' },
        { registered: false, firstName: 'DD', lastName: '04' },
        { registered: true, firstName: 'EE', lastName: '05' },
        { registered: false, firstName: 'FF', lastName: '06' },
        { registered: true, firstName: 'GG', lastName: '07' }
      ],
      '1'
    );

    let results = await service.findConnection(
      undefined,
      ['registered_ASC', 'firstName_ASC'],
      { first: 4 },
      {
        edges: { node: { firstName: true, registered: true } },
        pageInfo: { endCursor: {}, hasNextPage: {}, hasPreviousPage: {} }
      }
    );

    expect(results.edges?.map(edge => edge.node?.firstName)).toEqual(['BB', 'DD', 'FF', 'AA']);
    expect(results.pageInfo?.hasNextPage).toEqual(true);

    const cursor = results.pageInfo?.endCursor;

    results = await service.findConnection(
      undefined,
      ['registered_ASC', 'firstName_ASC'],
      { first: 3, after: cursor },
      {
        edges: { node: { firstName: true } },
        pageInfo: { endCursor: {}, hasNextPage: {}, hasPreviousPage: {} }
      }
    );

    expect(results.edges?.map(edge => edge.node?.firstName)).toEqual(['CC', 'EE', 'GG']);
  });

  test.skip('fun with brackets', async () => {
    await service.createMany(
      [
        { firstName: 'Timber', lastName: 'Saw' },
        { firstName: 'Pleerock', lastName: 'Pleerock' },
        { firstName: 'Alex', lastName: 'Messer' }
      ],
      '1'
    );

    const bases = await connection
      .createQueryBuilder(MyBase, 'user')
      .where('user.lastName = :lastName0', { lastName0: 'Pleerock' })
      .orWhere(
        new Brackets(qb => {
          qb.where('user.firstName = :firstName1', {
            firstName1: 'Timber'
          }).andWhere('user.lastName = :lastName1', { lastName1: 'Saw' });
        })
      )
      .orWhere(
        new Brackets(qb => {
          qb.where('user.firstName = :firstName2', {
            firstName2: 'Alex'
          }).andWhere('user.lastName = :lastName2', { lastName2: 'Messer' });
        })
      )
      .getMany();

    expect(bases.length).toEqual(3);
  });
});
