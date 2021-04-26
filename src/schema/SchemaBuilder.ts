import { GraphQLID, GraphQLSchema } from 'graphql';
// import { DateResolver } from 'graphql-scalars';
import { AuthChecker, buildSchema } from 'type-graphql'; // formatArgumentValidationError
import { Middleware } from 'type-graphql/dist/interfaces/Middleware';
import { ScalarsTypeMap } from 'type-graphql/dist/schema/build-context';
import { Container, Inject, Service } from 'typedi';

import { Config } from '../core';
import { DataLoaderMiddleware } from '../middleware';

interface BuildOptions<C> {
  authChecker?: AuthChecker<C>;
  middlewares?: Middleware[];
  scalers?: ScalarsTypeMap[];
}

@Service('SchemaBuilder')
export class SchemaBuilder {
  constructor(@Inject('Config') readonly config: Config) {}

  async build<C>(options: BuildOptions<C>): Promise<GraphQLSchema> {
    return buildSchema({
      authChecker: options.authChecker,
      scalarsMap: [
        {
          type: 'ID' as any,
          scalar: GraphQLID
        }
      ],
      container: Container,
      dateScalarMode: 'isoDate',
      // TODO: ErrorLoggerMiddleware
      globalMiddlewares: [DataLoaderMiddleware, ...(options.middlewares || [])],
      resolvers: this.config.get('RESOLVERS_PATH'),
      // TODO: scalarsMap: [{ type: GraphQLDate, scalar: GraphQLDate }]
      validate: this.config.get('VALIDATE_RESOLVERS') === 'true'
    });
  }
}
