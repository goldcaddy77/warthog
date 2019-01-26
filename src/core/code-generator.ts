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
    await this.writeGeneratedIndexFile();
    await this.writeGeneratedTSTypes();
    await this.writeOrmConfig();
    await this.writeSchemaFile();
    await this.generateBinding();
  }

  private async generateBinding() {
    const schemaFilePath = path.join(this.generatedFolder, 'schema.graphql');
    const outputBindingPath = path.join(this.generatedFolder, 'binding.ts');

    return generateBindingFile(schemaFilePath, outputBindingPath);
  }

  private async buildGraphQLSchema(): Promise<GraphQLSchema> {
    if (!this.schema) {
      this.schema = await buildSchema({
        // Note: using the base authChecker here just to generated the .graphql file
        // it's not actually being utilized here
        authChecker,
        resolvers: this.options.resolversPath
      });
    }

    return this.schema;
  }

  private async writeGeneratedTSTypes() {
    const generatedTSTypes = await this.getGeneratedTypes();

    return this.writeToGeneratedFolder('classes.ts', generatedTSTypes);
  }

  private async getGeneratedTypes() {
    return SchemaGenerator.generate(
      this.connection.entityMetadatas,
      this.options.warthogImportPath
    );
  }

  private async writeSchemaFile() {
    await this.buildGraphQLSchema();

    return this.writeToGeneratedFolder('schema.graphql', printSchema(this.schema as GraphQLSchema));
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
  subscribers: ['src/**/*.model.ts'],
  synchronize:
    typeof process.env.TYPEORM_SYNCHRONIZE !== 'undefined'
      ? process.env.TYPEORM_SYNCHRONIZE
      : process.env.NODE_ENV === 'development',
  type: 'postgres',
  username: process.env.TYPEORM_USERNAME
};`;

    return this.writeToGeneratedFolder('ormconfig.ts', contents);
  }

  private async writeToGeneratedFolder(filename: string, contents: string) {
    return writeFilePromise(path.join(this.generatedFolder, filename), contents, {
      encoding: 'utf8',
      flag: 'w'
    });
  }
}
