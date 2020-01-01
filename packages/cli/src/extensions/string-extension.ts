import { WarthogGluegunToolbox } from '../types';

module.exports = (toolbox: WarthogGluegunToolbox) => {
  toolbox.string = {
    supplant: function supplant(str: string, obj: Record<string, any>) {
      return str.replace(/\${([^${}]*)}/g, (a, b) => {
        const r = obj[b];
        return typeof r === 'string' ? r : a;
      });
    }
  };
};
