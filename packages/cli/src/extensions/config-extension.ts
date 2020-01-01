import { Config } from '@warthog/core';

import { WarthogGluegunToolbox } from '../types';

module.exports = (toolbox: WarthogGluegunToolbox) => {
  toolbox.config = {
    load: function create() {
      return new Config();
    }
  };
};
