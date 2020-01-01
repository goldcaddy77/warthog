import { GluegunToolbox } from 'gluegun';

export interface WarthogGluegunToolbox extends GluegunToolbox {
  config: {
    load: Function;
  };
  db: {
    create: Function;
    drop: Function;
    migrate: Function;
    generateMigration: Function;
  };
  string: {
    supplant: Function;
  };
}
