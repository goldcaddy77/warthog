import { Container } from 'typedi';
import { CodeGenerator, logger } from '../../core';
import { WarthogGluegunToolbox } from '../types';

Container.import([CodeGenerator]);

// BLOG: needed to switch from module.exports because it didn't compile correctly
export default {
  // module.exports = {
  name: 'codegen',
  run: async (toolbox: WarthogGluegunToolbox) => {
    const {
      parameters: { options }
    } = toolbox;

    const generateOptions = options.binding ? { generateBinding: true } : {};

    try {
      const generator = Container.get('CodeGenerator') as CodeGenerator;
      await generator.generate(generateOptions);
    } catch (error) {
      logger.error(error);
      if (error.name.indexOf('Cannot determine GraphQL input type') > -1) {
        logger.error('This often means you have multiple versions of TypeGraphQL installed.');
      }
    }
  }
};
