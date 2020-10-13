import { GraphQLID, GraphQLSchema } from 'graphql';
import { DateResolver } from 'graphql-scalars';
import { AuthChecker, buildSchema } from 'type-graphql'; // TODO: need to replace this
import { Middleware } from 'type-graphql/dist/interfaces/Middleware'; // TODO: need to replace this
import { Container, Inject, Service } from 'typedi';

import { Config } from '../core';
import { DataLoaderMiddleware } from '../middleware';

interface BuildOptions<C> {
  authChecker?: AuthChecker<C>;
  middlewares?: Middleware[];
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
        },
        // Note: DateTime already included in @nestjs/graphql
        {
          type: 'DateOnlyString' as any,
          scalar: DateResolver
        }
      ],
      container: Container,
      // TODO: ErrorLoggerMiddleware
      globalMiddlewares: [DataLoaderMiddleware, ...(options.middlewares || [])],
      resolvers: this.config.get('RESOLVERS_PATH'),
      // TODO: scalarsMap: [{ type: GraphQLDate, scalar: GraphQLDate }]
      validate: this.config.get('VALIDATE_RESOLVERS') === 'true'
    });
  }
}
