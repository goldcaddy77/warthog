import { GluegunToolbox } from 'gluegun';

export interface WarthogGluegunToolbox extends GluegunToolbox {
  db: {
    create: Function;
    drop: Function;
  };
}
