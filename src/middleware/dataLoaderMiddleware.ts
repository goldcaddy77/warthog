import DataLoader = require('dataloader');
import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import { Service } from 'typedi';

import { Context } from '../tgql';

@Service()
export class DataLoaderMiddleware implements MiddlewareInterface<Context> {
  async use({ root, args, context, info }: ResolverData<Context>, next: NextFn) {
    if (!context.dataLoader.initialized) {
      context.dataLoader = {
        initialized: true,
        loaders: {}
      };

      const loaders = context.dataLoader.loaders!;

      context.connection.entityMetadatas.forEach(entityMetadata => {
        const resolverName = entityMetadata.targetName;
        if (!resolverName) {
          return;
        }

        if (!loaders[resolverName]) {
          loaders[resolverName] = {};
        }

        entityMetadata.relations.forEach(relation => {
          // define data loader for this method if it was not defined yet
          if (!loaders[resolverName][relation.propertyName]) {
            loaders[resolverName][relation.propertyName] = new DataLoader((entities: any[]) => {
              if (Array.isArray(entities) && entities[0] && Array.isArray(entities[0])) {
                throw new Error('You must flatten arrays of arrays of entities');
              }
              return context.connection.relationIdLoader
                .loadManyToManyRelationIdsAndGroup(relation, entities)
                .then(groups => groups.map(group => group.related));
            });
          }
        });
      });
    }
    return next();
  }
}
