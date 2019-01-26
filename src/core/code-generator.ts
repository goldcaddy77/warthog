// TODO-MVP: Add custom scalars such as graphql-iso-date
// import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';

import { writeFileSync } from 'fs';
import { GraphQLSchema, printSchema } from 'graphql';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import { buildSchema } from 'type-graphql';
import { Connection } from 'typeorm';

import { generateBindingFile } from '../gql';
import { SchemaGenerator } from '../schema';
import { authChecker } from '../tgql';

interface CodeGeneratorOptions {
  warthogImportPath?: string;
  resolversPath?: string[];
}

export class CodeGenerator {
  resolversPath: string[];
  schema?: GraphQLSchema;

  constructor(
    private connection: Connection,
    private generatedFolder: string,
    private options: CodeGeneratorOptions
  ) {
    if (!connection) {
      throw new Error('FileGenerator: connection is required');
    }

    // Use https://github.com/inxilpro/node-app-root-path to find project root
    this.generatedFolder = this.generatedFolder || path.join(process.cwd(), 'generated');
    this.resolversPath = this.options.resolversPath || [process.cwd() + '/**/*.resolver.ts'];
    this.createGeneratedFolder();
  }

  createGeneratedFolder() {
    return mkdirp.sync(this.generatedFolder);
  }

  async generate() {
    await this.writeGeneratedIndexFile();
    await this.writeGeneratedTSTypes();
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
        resolvers: this.resolversPath
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

  private async writeToGeneratedFolder(filename: string, contents: string) {
    return writeFileSync(path.join(this.generatedFolder, filename), contents, {
      encoding: 'utf8',
      flag: 'w'
    });
  }
}
