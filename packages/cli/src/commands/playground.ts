const open = require('open'); // eslint-disable-line @typescript-eslint/no-var-requires

import { WarthogGluegunToolbox } from '../types';

export default {
  name: 'playground',
  run: async (toolbox: WarthogGluegunToolbox) => {
    const config: any = toolbox.config.load();

    const host = config.get('APP_HOST');
    const port = config.get('APP_PORT');
    const url = `http://${host}:${port}/playground`;

    return open(url, { wait: false });
  }
};
