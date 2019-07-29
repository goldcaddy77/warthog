import { GluegunToolbox } from 'gluegun';

export default {
  name: 'warthog',
  run: async (toolbox: GluegunToolbox) => {
    const { print } = toolbox;

    print.info('Warthog: GraphQL API Framework');
  }
};
