// TODO-MVP: Add custom scalars such as graphql-iso-date
// import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';

import { writeFile } from 'fs';
import { GraphQLID, GraphQLSchema, printSchema } from 'graphql';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import { buildSchema } from 'type-graphql';
import * as util from 'util';

import { generateBindingFile } from '../gql';
import { SchemaGenerator } from './schema-generator';
import { authChecker } from '../tgql';
import { logger } from '../core';
import { loadFromGlobArray } from '../utils';
// Load all model files so that decorators will gather metadata for code generation

import * as Debug from 'debug';

const debug = Debug('warthog:code-generators');

const writeFilePromise = util.promisify(writeFile);

interface CodeGeneratorOptions {
  resolversPath: string[];
  validateResolvers?: boolean;
  warthogImportPath?: string;
}

export class CodeGenerator {
  schema?: GraphQLSchema;

  constructor(
    private generatedFolder: string,
    // @ts-ignore
    private modelsArray: string[],
    private options: CodeGeneratorOptions
  ) {
    this.createGeneratedFolder();
    loadFromGlobArray(modelsArray);
  }

  createGeneratedFolder() {
    return mkdirp.sync(this.generatedFolder);
  }

  async generate() {
    debug('generate:start');
    try {
      await this.writeGeneratedIndexFile();
      await this.writeGeneratedTSTypes();
      await this.writeOrmConfig();
      await this.writeSchemaFile();
      await this.generateBinding();
    } catch (error) {
      logger.error(error);
      debug(error); // this is required to log when run in a separate project
    }
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
      debug('code-generator:buildGraphQLSchema:start');
      debug(this.options.resolversPath);
      this.schema = await buildSchema({
        // TODO: we should replace this with an empty authChecker
        // Note: using the base authChecker here just to generated the .graphql file
        // it's not actually being utilized here
        authChecker,
        scalarsMap: [
          {
            type: 'ID' as any,
            scalar: GraphQLID
          }
        ],
        resolvers: this.options.resolversPath,
        validate: this.options.validateResolvers
      });
      debug('code-generator:buildGraphQLSchema:end');
    }

    return this.schema;
  }

  private async writeGeneratedTSTypes() {
    debug('writeGeneratedTSTypes:start');
    const generatedTSTypes = await this.getGeneratedTypes();
    const x = await this.writeToGeneratedFolder('classes.ts', generatedTSTypes);
    debug('writeGeneratedTSTypes:end');
    return x;
  }

  private async getGeneratedTypes() {
    debug('getGeneratedTypes:start');
    const x = SchemaGenerator.generate(this.options.warthogImportPath);
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
    const contents = `import { getBaseConfig } from '${this.options.warthogImportPath}';

module.exports = getBaseConfig();`;

    return this.writeToGeneratedFolder('ormconfig.ts', contents);
  }

  private async writeToGeneratedFolder(filename: string, contents: string) {
    debug('writeToGeneratedFolder:' + filename + ':start');
    const x = await writeFilePromise(path.join(this.generatedFolder, filename), contents, {
      encoding: 'utf8',
      flag: 'w'
    });
    debug('writeToGeneratedFolder:' + filename + ':end');
    return x;
  }
}
