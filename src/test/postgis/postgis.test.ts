import * as path from 'path';
import Container, { Service } from 'typedi';
import { Connection } from 'typeorm';
import { Config, getContainer } from '../../core';
import { Database } from '../../torm';
import { getStandardEnvironmentVariables } from '../server-vars';
import { PostgisModelTestService } from './postgis.model';

export interface Dictionary {
  [key: string]: any;
}

@Service()
class MockConfig {
  config: Dictionary;

  constructor() {
    const standardVars = getStandardEnvironmentVariables();
    this.config = {
      ...standardVars,
      FILTER_BY_DEFAULT: 'false',
      GENERATED_FOLDER: path.join(__dirname, 'generated'),
      DB_ENTITIES: [path.join(`${__dirname}/**/*.model.ts`)],
      RESOLVERS_PATH: [path.join(`${__dirname}/**/*.resolver.ts`)],
      VALIDATE_RESOLVERS: false,
      MODULE_IMPORT_PATH: '../../../'
    };
  }

  public get(key: string) {
    if (typeof this.config[key] !== 'undefined') {
      return this.config[key];
    }
    return this.config[`WARTHOG_${key}`];
  }
}

describe('Postgis', () => {
  let service: PostgisModelTestService;
  let connection: Connection;

  // Make sure to clean up server
  beforeAll(async done => {
    const config = new MockConfig() as Config;
    Container.set('Config', config);

    const database = getContainer(Database);
    connection = await database.createDBConnection();
    service = getContainer(PostgisModelTestService);

    done();
  });

  // Make sure to clean up server
  afterAll(async done => {
    await connection.close();
    done();
  });

  test.only('Geography creating and updating', async () => {
    const geoPoint = {
      latitude: 100,
      longitude: 0
    };
    const geoPoint2 = {
      latitude: 50,
      longitude: 50
    };

    let record = await service.create(
      {
        geographyPoint: geoPoint
      },
      '1'
    );
    expect(record.geographyPoint).toEqual(geoPoint);

    record = await service.findOne({ id: record.id });
    expect(record.geographyPoint).toEqual(geoPoint);

    record = await service.update({ geographyPoint: geoPoint2 }, { id: record.id }, '1');
    expect(record.geographyPoint).toEqual(geoPoint2);
  });
});
