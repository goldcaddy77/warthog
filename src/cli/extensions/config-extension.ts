import { Config } from '../../';

import { WarthogGluegunToolbox } from '../types';

module.exports = (toolbox: WarthogGluegunToolbox) => {
  toolbox.config = {
    load: function create() {
      return new Config();
    }
  };
};
