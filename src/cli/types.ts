import { GluegunToolbox } from 'gluegun';

export interface WarthogGluegunToolbox extends GluegunToolbox {
  config: {
    load: Function;
  };
  db: {
    create: Function;
    drop: Function;
  };
  string: {
    supplant: Function;
  };
}
