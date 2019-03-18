// TODO-MVP: Add custom scalars such as graphql-iso-date
// import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';

import { writeFile } from 'fs';
import { GraphQLSchema, printSchema } from 'graphql';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import { buildSchema } from 'type-graphql';
import { Connection } from 'typeorm';
import * as util from 'util';

import { generateBindingFile } from '../gql';
import { SchemaGenerator } from '../schema';
import { authChecker } from '../tgql';

import * as Debug from 'debug';

const debug = Debug('warthog:code-generators');

const writeFilePromise = util.promisify(writeFile);

interface CodeGeneratorOptions {
  resolversPath: string[];
  warthogImportPath?: string;
}

export class CodeGenerator {
  schema?: GraphQLSchema;

  constructor(
    private connection: Connection,
    private generatedFolder: string,
    private options: CodeGeneratorOptions
  ) {
    if (!connection) {
      throw new Error('FileGenerator: connection is required');
    }

    this.createGeneratedFolder();
  }

  createGeneratedFolder() {
    return mkdirp.sync(this.generatedFolder);
  }

  async generate() {
    debug('generate:start');
    await this.writeGeneratedIndexFile();
    await this.writeGeneratedTSTypes();
    await this.writeOrmConfig();
    await this.writeSchemaFile();
    await this.generateBinding();
    debug('generate:end');
  }

  private async generateBinding() {
    debug('generateBinding:start');
    const schemaFilePath = path.join(this.generatedFolder, 'schema.graphql');
    const outputBindingPath = path.join(this.generatedFolder, 'binding.ts');

    const x = generateBindingFile(schemaFilePath, outputBindingPath);
    debug('generateBinding:end');
    return x;
  }

  private async buildGraphQLSchema(): Promise<GraphQLSchema> {
    if (!this.schema) {
      debug('buildGraphQLSchema:start');
      this.schema = await buildSchema({
        // Note: using the base authChecker here just to generated the .graphql file
        // it's not actually being utilized here
        authChecker,
        resolvers: this.options.resolversPath
      });
      debug('buildGraphQLSchema:end');
    }

    return this.schema;
  }

  private async writeGeneratedTSTypes() {
    debug('writeGeneratedTSTypes:start');
    const generatedTSTypes = await this.getGeneratedTypes();

    const x = this.writeToGeneratedFolder('classes.ts', generatedTSTypes);
    debug('writeGeneratedTSTypes:end');
    return x;
  }

  private async getGeneratedTypes() {
    debug('getGeneratedTypes:start');
    const x = SchemaGenerator.generate(
      this.connection.entityMetadatas,
      this.options.warthogImportPath
    );
    debug('getGeneratedTypes:end');
    return x;
  }

  private async writeSchemaFile() {
    debug('writeSchemaFile:start');
    await this.buildGraphQLSchema();

    const x = this.writeToGeneratedFolder(
      'schema.graphql',
      printSchema(this.schema as GraphQLSchema)
    );

    debug('writeSchemaFile:end');
    return x;
  }

  // Write an index file that loads `classes` so that you can just import `../../generated`
  // in your resolvers
  private async writeGeneratedIndexFile() {
    return this.writeToGeneratedFolder('index.ts', `export * from './classes';`);
  }

  private async writeOrmConfig() {
    const contents = `
import { SnakeNamingStrategy } from '${this.options.warthogImportPath}';

module.exports = {
  cli: {
    entitiesDir: 'src/models',
    migrationsDir: 'db/migrations',
    subscribersDir: 'src/subscribers'
  },
  database: process.env.TYPEORM_DATABASE,
  entities: process.env.TYPEORM_ENTITIES || ['src/**/*.model.ts'],
  host: process.env.TYPEORM_HOST || 'localhost',
  logger: 'advanced-console',
  logging: process.env.TYPEORM_LOGGING || 'all',
  migrations: ['db/migrations/**/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
  password: process.env.TYPEORM_PASSWORD,
  port: parseInt(process.env.TYPEORM_PORT || '', 10) || 5432,
  subscribers: process.env.TYPEORM_SUBSCRIBERS || ['src/**/*.model.ts'],
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  type: 'postgres',
  username: process.env.TYPEORM_USERNAME
};`;

    return this.writeToGeneratedFolder('ormconfig.ts', contents);
  }

  private async writeToGeneratedFolder(filename: string, contents: string) {
    debug('writeToGeneratedFolder:' + filename + ':start');
    const x = writeFilePromise(path.join(this.generatedFolder, filename), contents, {
      encoding: 'utf8',
      flag: 'w'
    });
    debug('writeToGeneratedFolder:' + filename + ':end');
    return x;
  }
}
