// TODO-MVP: Add custom scalars such as graphql-iso-date
// import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';

import { GraphQLSchema, printSchema } from 'graphql';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import { Container, Inject, Service } from 'typedi';

import { Config, logger } from '../core';
import { debug } from '../decorators';
import { generateBindingFile } from '../gql';
import { SchemaBuilder, SchemaGenerator } from '../schema';
import { authChecker, loadFromGlobArray } from '../tgql';
import { writeFilePromise } from '../utils';

Container.import([SchemaGenerator]);

@Service('CodeGenerator')
export class CodeGenerator {
  generatedFolder: string;
  schema?: GraphQLSchema;

  constructor(
    @Inject('Config') readonly config: Config,
    @Inject('SchemaGenerator') readonly schemaGenerator: SchemaGenerator,
    @Inject('SchemaBuilder') readonly schemaBuilder: SchemaBuilder
  ) {
    this.generatedFolder = this.config.get('GENERATED_FOLDER');
    this.createGeneratedFolder();

    loadFromGlobArray(this.config.get('DB_ENTITIES'));
  }

  createGeneratedFolder() {
    return mkdirp.sync(this.generatedFolder);
  }

  @debug('warthog:code-generator')
  async generate() {
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
  }

  private async generateBinding() {
    const schemaFilePath = path.join(this.generatedFolder, 'schema.graphql');
    const outputBindingPath = path.join(this.generatedFolder, 'binding.ts');

    return generateBindingFile(schemaFilePath, outputBindingPath);
  }

  // @debug
  private async buildGraphQLSchema(): Promise<GraphQLSchema> {
    if (!this.schema) {
      this.schema = await this.schemaBuilder.build({
        authChecker
      });
    }

    return this.schema;
  }

  private async writeGeneratedTSTypes() {
    const generatedTSTypes = this.getGeneratedTypes();
    return this.writeToGeneratedFolder('classes.ts', generatedTSTypes);
  }

  // @debug
  private getGeneratedTypes() {
    return this.schemaGenerator.generate(this.config.get('MODULE_IMPORT_PATH'));
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
    const contents = `import { getBaseConfig } from '${this.config.get('MODULE_IMPORT_PATH')}';

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
