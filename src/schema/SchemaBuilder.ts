// const folderGlob = `${this.config.get('ROOT_FOLDER')}/${this.config.get('SCALARS_PATH')}`;
// console.log('folderGlob :>> ', folderGlob);
// const files = glob.sync(folderGlob);

import { GraphQLID, GraphQLScalarType, GraphQLSchema } from 'graphql';
import { PubSubEngine, PubSubOptions } from 'graphql-subscriptions';
// import { DateResolver } from 'graphql-scalars';
import { AuthChecker, buildSchema } from 'type-graphql'; // formatArgumentValidationError
import { Middleware } from 'type-graphql/dist/interfaces/Middleware';
import { ScalarsTypeMap } from 'type-graphql/dist/schema/build-context';
import { Container } from 'typedi';
import { Config, getContainer } from '../core';
import { DataLoaderMiddleware } from '../middleware';
import { loadFromGlobArray } from '../tgql';

interface BuildOptions<C> {
  authChecker?: AuthChecker<C>;
  middlewares?: Middleware[];
  pubSub?: PubSubEngine | PubSubOptions;
  scalars?: ScalarsTypeMap[];
}

interface SchemaBuilderOptions {
  resolvers: (string | Function)[];
  validate?: boolean;
}

export class SchemaBuilder {
  config: Config;
  constructor(private options: SchemaBuilderOptions) {
    this.config = getContainer(Config);
  }

  async build<C>(options: BuildOptions<C>): Promise<GraphQLSchema> {
    const scalars = this.loadScalarFiles();
    const scalarsMap = [
      {
        type: 'ID' as any,
        scalar: GraphQLID
      },
      ...scalars
    ];
    // console.log('scalarsMap :>> ', scalarsMap);

    return buildSchema({
      authChecker: options.authChecker,
      scalarsMap,
      container: Container,
      dateScalarMode: 'isoDate',
      // TODO: ErrorLoggerMiddleware
      globalMiddlewares: [DataLoaderMiddleware, ...(options.middlewares || [])],
      pubSub: options.pubSub,
      resolvers: this.options.resolvers,
      validate: !!this.options.validate
    });
  }

  loadScalarFiles() {
    // console.log('this.config.get(SCALARS_PATH) :>> ', this.config.get('SCALARS_PATH'));
    const files = loadFromGlobArray(this.config.get('SCALARS_PATH'));
    // console.log('files :>> ', files);

    return files.map(file => {
      const scalar = file.default as GraphQLScalarType;
      // console.log('scalar :>> ', scalar);
      // console.log('typeof scalar :>> ', typeof scalar);
      // console.log('scalar.name :>> ', scalar.name);
      return {
        type: scalar.name as any,
        scalar
      };
    });
  }
}
