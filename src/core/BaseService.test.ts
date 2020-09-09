// import { Container, Service } from 'typedi';
import { Repository } from 'typeorm';

import { BaseModel } from '../';
import { BaseService } from './BaseService';

const mockQueryBuilder = jest.fn(() => ({
  delete: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  execute: jest.fn().mockReturnThis()
}));

const mockManager = {
  createQueryBuilder: async () => mockQueryBuilder
};

const mockRepository = (jest.fn(() => ({
  save: async () => {},
  dispose: async () => {},
  createQueryBuilder: async () => mockQueryBuilder,
  manager: mockManager,
  metadata: {
    name: 'user',
    columns: [
      {
        propertyPath: 'id',
        databasePath: 'id'
      },
      {
        propertyPath: 'createdAt',
        databasePath: 'created_at'
      },
      {
        propertyPath: 'firstName',
        databasePath: 'first_name'
      }
    ]
  }
}))() as any) as Repository<BaseModel>;

describe('BaseService', () => {
  const baseService = new BaseService('fakeClass', mockRepository);
  //   const e = Container.get(EncodingService);
  //   const sortIdASC = { column: 'id', direction: 'ASC' as SortDirection };
  //   const sortIdDESC = { column: 'id', direction: 'DESC' as SortDirection };
  //   const sortCreatedAtASC = { column: 'createdAt', direction: 'ASC' as SortDirection };
  //   const sortFooDESC = { column: 'foo', direction: 'DESC' as SortDirection };

  //   const foo = new Foo();
  //   foo.id = '1';
  //   foo.name = 'Foo';
  //   foo.createdAt = new Date('1981-10-15');

  //   const bar = new Foo();
  //   bar.id = '2';
  //   bar.name = 'Bar';
  //   bar.createdAt = new Date('1989-11-20');

  describe('findConnection', () => {
    test('foo', () => {
      expect(baseService.findConnection()).toStrictEqual('foo');
    });
  });
});
