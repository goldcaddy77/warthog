const open = require('open'); // eslint-disable-line @typescript-eslint/no-var-requires

import { WarthogGluegunToolbox } from '../types';

export default {
  name: 'playground',
  run: async (toolbox: WarthogGluegunToolbox) => {
    const config: any = toolbox.config.load();

    return open(config.getApiUrl('/playground'), { wait: false });
  }
};
