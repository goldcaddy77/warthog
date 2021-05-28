import * as path from 'path';
import Container, { Service } from 'typedi';
import { Connection } from 'typeorm';
import { CodeGenerator, Config, getContainer } from '../../core';
import { SchemaGenerator } from '../../schema';
import { Database } from '../../torm';
import { getStandardEnvironmentVariables } from '../server-vars';
import { MyBaseModelTestService } from './my-base-model.model';

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

describe('MyBaseModel', () => {
  let service: any; //  MyBaseModelTestService;
  let connection: Connection;

  // Make sure to clean up server
  beforeAll(async done => {
    const config = new MockConfig() as Config;
    Container.set('Config', config);

    const database = getContainer(Database);
    connection = await database.createDBConnection();
    service = getContainer(MyBaseModelTestService);

    const schemaGenerator = new SchemaGenerator(config);
    const codeGenerator = new CodeGenerator(config, schemaGenerator);
    await codeGenerator.generate({ generateBinding: false });

    done();
  });

  // Make sure to clean up server
  afterAll(async done => {
    await connection.close();
    done();
  });

  test('standard fields are automatically set on create', async () => {
    const userId = 'u_00123';
    const testModel = await service.create({ stringField: 'foo' }, userId);

    expect(testModel.createdById).toBe(userId);
    expect(testModel.ownerId).toBe(userId);
    expect(testModel.updatedById).toBeNull();
    expect(testModel.deletedById).toBeNull();

    expect(testModel.createdAt instanceof Date).toBeTruthy();
    expect(testModel.updatedAt instanceof Date).toBeTruthy();
    expect(testModel.deletedAt instanceof Date).toBeFalsy();
    expect(testModel.deletedAt).toBeNull();

    expect(testModel.version).toBe(1);
    expect(testModel.stringField).toBe('foo');
  });

  test('standard fields are automatically set on update', async () => {
    const userId = 'u_00123';
    const testModel = await service.create({ stringField: 'foo' }, userId);

    expect(testModel.createdById).toBe(userId);
    expect(testModel.ownerId).toBe(userId);
    expect(testModel.updatedById).toBeNull();

    expect(testModel.createdAt instanceof Date).toBeTruthy();
    expect(testModel.updatedAt instanceof Date).toBeTruthy();
    expect(testModel.deletedAt instanceof Date).toBeFalsy();
    expect(testModel.deletedAt).toBeNull();

    expect(testModel.version).toBe(1);
    expect(testModel.stringField).toBe('foo');
  });
});
