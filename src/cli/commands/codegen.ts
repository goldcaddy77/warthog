import { Container } from 'typedi';

import { logger } from '../../core';
import { CodeGenerator } from '../../core';

Container.import([CodeGenerator]);

// BLOG: needed to switch from module.exports because it didn't compile correctly
export default {
  // module.exports = {
  name: 'codegen',
  run: async () => {
    try {
      const generator = Container.get('CodeGenerator') as CodeGenerator;
      await generator.generate();
    } catch (error) {
      logger.error(error);
      if (error.name.indexOf('Cannot determine GraphQL input type') > -1) {
        logger.error('This often means you have multiple versions of TypeGraphQL installed.');
      }
    }
  }
};
