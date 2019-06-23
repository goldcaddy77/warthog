const open = require('open'); // eslint-disable-line @typescript-eslint/no-var-requires

import { Config } from '../../../src/core';

export default {
  name: 'playground',
  run: async () => {
    const config: any = new Config().loadSync();

    const host = config.get('APP_HOST');
    const port = config.get('APP_PORT');
    const url = `http://${host}:${port}/playground`;

    return open(url, { wait: false });
  }
};
